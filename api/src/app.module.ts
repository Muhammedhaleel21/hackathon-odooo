import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: environmentValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    StaffModule,
    HealthModule,
  ],
})
export class AppModule {}
