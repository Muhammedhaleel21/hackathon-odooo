import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import {
  authSessions,
  passwordResetTokens,
  users,
  User,
  AuthSession,
  PasswordResetToken,
} from '../database/schema';
import { UserRole } from './auth.types';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async findUserById(id: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, normalized))
      .limit(1);
    return user || null;
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        role: data.role || 'customer',
        isActive: true,
      })
      .returning();
    return user;
  }

  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<AuthSession> {
    const [session] = await this.db
      .insert(authSessions)
      .values({
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      })
      .returning();
    return session;
  }

  async findActiveSessionByHash(
    refreshTokenHash: string,
  ): Promise<AuthSession | null> {
    const now = new Date();
    const [session] = await this.db
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.refreshTokenHash, refreshTokenHash),
          isNull(authSessions.revokedAt),
          gt(authSessions.expiresAt, now),
        ),
      )
      .limit(1);
    return session || null;
  }

  async revokeSession(id: string): Promise<void> {
    await this.db
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.id, id));
  }

  async revokeSessionByHash(refreshTokenHash: string): Promise<void> {
    await this.db
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(authSessions.refreshTokenHash, refreshTokenHash),
          isNull(authSessions.revokedAt),
        ),
      );
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.db
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(authSessions.userId, userId),
          isNull(authSessions.revokedAt),
        ),
      );
  }

  async createPasswordResetToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    const [token] = await this.db
      .insert(passwordResetTokens)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      })
      .returning();
    return token;
  }

  async findUnusedPasswordResetToken(
    tokenHash: string,
  ): Promise<PasswordResetToken | null> {
    const now = new Date();
    const [token] = await this.db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, now),
        ),
      )
      .limit(1);
    return token || null;
  }

  async markPasswordResetTokenUsed(id: string): Promise<void> {
    await this.db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, id));
  }

  async updateUserPassword(
    userId: string,
    newPasswordHash: string,
  ): Promise<void> {
    await this.db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}
