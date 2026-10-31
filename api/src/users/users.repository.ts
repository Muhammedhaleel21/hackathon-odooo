import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import { users, User } from '../database/schema';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async findById(id: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async findCustomers(): Promise<
    Array<Pick<User, 'id' | 'name' | 'email' | 'isActive' | 'createdAt'>>
  > {
    return this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'customer'));
  }
}
