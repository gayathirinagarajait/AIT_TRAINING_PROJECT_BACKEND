import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Load env based on environment
  dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
  });

  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Global validation (future proof – DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unwanted fields
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS (required for frontend)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/api`);
}
bootstrap();
