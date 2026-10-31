import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthRepository } from './auth.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  private readonly frontendResetUrl: string;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.frontendResetUrl = this.configService.getOrThrow<string>(
      'FRONTEND_RESET_URL',
    );
  }

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.authRepository.findUserByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(dto.password);

    // Rule: Public registration always assigns customer role
    const newUser = await this.authRepository.createUser({
      name: dto.name,
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
    });

    // Send welcome email asynchronously
    this.mailService
      .sendWelcomeEmail(newUser.email, newUser.name)
      .catch(() => {});

    return {
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(dto: LoginDto, response: Response) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.authRepository.findUserByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.passwordService.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const rawRefreshToken = this.tokenService.generateOpaqueToken();
    const refreshTokenHash = this.tokenService.hashToken(rawRefreshToken);

    await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    this.tokenService.setRefreshTokenCookie(response, rawRefreshToken);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    };
  }

  async refresh(rawRefreshToken: string | undefined, response: Response) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const refreshTokenHash = this.tokenService.hashToken(rawRefreshToken);
    const session =
      await this.authRepository.findActiveSessionByHash(refreshTokenHash);

    if (!session) {
      this.tokenService.clearRefreshTokenCookie(response);
      throw new UnauthorizedException('Invalid or expired refresh session');
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user || !user.isActive) {
      await this.authRepository.revokeSession(session.id);
      this.tokenService.clearRefreshTokenCookie(response);
      throw new UnauthorizedException('Account is unavailable');
    }

    // Revoke old session before issuing new token (token rotation)
    await this.authRepository.revokeSession(session.id);

    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const newRawRefreshToken = this.tokenService.generateOpaqueToken();
    const newRefreshTokenHash =
      this.tokenService.hashToken(newRawRefreshToken);

    await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    this.tokenService.setRefreshTokenCookie(response, newRawRefreshToken);

    return {
      message: 'Token refreshed',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    };
  }

  async logout(rawRefreshToken: string | undefined, response: Response) {
    if (rawRefreshToken) {
      const hash = this.tokenService.hashToken(rawRefreshToken);
      await this.authRepository.revokeSessionByHash(hash);
    }

    this.tokenService.clearRefreshTokenCookie(response);

    return {
      message: 'Logged out successfully',
    };
  }

  async logoutAll(userId: string, response: Response) {
    await this.authRepository.revokeAllUserSessions(userId);
    this.tokenService.clearRefreshTokenCookie(response);

    return {
      message: 'Logged out from all sessions successfully',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.authRepository.findUserByEmail(normalizedEmail);

    if (user && user.isActive) {
      const rawToken = this.tokenService.generateOpaqueToken();
      const tokenHash = this.tokenService.hashToken(rawToken);

      await this.authRepository.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt: this.tokenService.getPasswordResetExpiry(),
      });

      const resetUrl = `${this.frontendResetUrl}?token=${rawToken}`;
      await this.mailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl,
      );
    }

    // Anti-enumeration: Return generic success message regardless of existence
    return {
      message: 'If the account exists, a reset link will be sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.tokenService.hashToken(dto.token);
    const resetRecord =
      await this.authRepository.findUnusedPasswordResetToken(tokenHash);

    if (!resetRecord) {
      throw new BadRequestException(
        'Invalid or expired password reset link. Please request a new one.',
      );
    }

    const newPasswordHash = await this.passwordService.hashPassword(
      dto.newPassword,
    );

    await this.authRepository.updateUserPassword(
      resetRecord.userId,
      newPasswordHash,
    );
    await this.authRepository.markPasswordResetTokenUsed(resetRecord.id);

    // Revoke all active sessions so compromised or old sessions cannot be reused
    await this.authRepository.revokeAllUserSessions(resetRecord.userId);

    return {
      message:
        'Password has been reset successfully. Please log in with your new password.',
    };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    response: Response,
  ) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await this.passwordService.verifyPassword(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    const newPasswordHash = await this.passwordService.hashPassword(
      dto.newPassword,
    );

    await this.authRepository.updateUserPassword(userId, newPasswordHash);
    await this.authRepository.revokeAllUserSessions(userId);
    this.tokenService.clearRefreshTokenCookie(response);

    return {
      message: 'Password changed successfully. Please log in again.',
    };
  }

  async getMe(user: AuthenticatedUser) {
    const freshUser = await this.authRepository.findUserById(user.id);
    if (!freshUser || !freshUser.isActive) {
      throw new UnauthorizedException('User account is unavailable');
    }

    return {
      id: freshUser.id,
      name: freshUser.name,
      email: freshUser.email,
      role: freshUser.role,
      isActive: freshUser.isActive,
    };
  }
}
