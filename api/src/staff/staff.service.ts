import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import { users } from '../database/schema';
import { AuthRepository } from '../auth/auth.repository';
import { PasswordService } from '../auth/services/password.service';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @Inject(DRIZZLE) private readonly db: AppDatabase,
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createStaff(dto: CreateStaffDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.authRepository.findUserByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(dto.password);

    // Rule: Staff creation endpoint strictly assigns 'staff' role
    const staffUser = await this.authRepository.createUser({
      name: dto.name,
      email: normalizedEmail,
      passwordHash,
      role: 'staff',
    });

    return {
      message: 'Staff account created successfully',
      staff: {
        id: staffUser.id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        isActive: staffUser.isActive,
        createdAt: staffUser.createdAt,
      },
    };
  }

  async getAllStaff() {
    const staffList = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.role, 'staff'));

    return staffList;
  }

  async updateStaffStatus(id: string, isActive: boolean) {
    const user = await this.authRepository.findUserById(id);

    if (!user || user.role !== 'staff') {
      throw new NotFoundException('Staff member not found');
    }

    await this.db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    // If deactivated, revoke all active sessions immediately
    if (!isActive) {
      await this.authRepository.revokeAllUserSessions(id);
    }

    return {
      message: `Staff account ${isActive ? 'activated' : 'deactivated'} successfully`,
      staff: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive,
      },
    };
  }
}
