import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  // API versioning prefix
  app.setGlobalPrefix('api/v1');

  // CORS — allow Next.js frontend
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Global request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('API_PORT', 4000);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API running at http://localhost:${port}/api/v1`);
  console.log(`🏥 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();

