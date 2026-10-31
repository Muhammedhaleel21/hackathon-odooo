import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import type { Response } from 'express';
import { JwtPayload, UserRole } from '../auth.types';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenDays: number;
  private readonly cookieName: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.jwtExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    this.refreshTokenDays = Number(
      this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_DAYS', 7),
    );
    this.cookieName = this.configService.get<string>(
      'REFRESH_COOKIE_NAME',
      'refresh_token',
    );
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  async generateAccessToken(user: {
    id: string;
    role: UserRole;
  }): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

      return(this.jwtService as any).signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      });
  }

  generateOpaqueToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.refreshTokenDays);
    return expiry;
  }

  getPasswordResetExpiry(): Date {
    const minutes = Number(
      this.configService.get<number>('PASSWORD_RESET_EXPIRES_IN_MINUTES', 15),
    );
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
  }

  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    (response as any).cookie(this.cookieName, refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: this.refreshTokenDays * 24 * 60 * 60 * 1000,
    });
  }

  clearRefreshTokenCookie(response: Response): void {
    (response as any).clearCookie(this.cookieName, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
    });
  }

  getCookieName(): string {
    return this.cookieName;
  }
}
