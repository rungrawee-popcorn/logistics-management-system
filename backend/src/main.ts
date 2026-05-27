import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
   |--------------------------------------------------------------------------
   | Global Validation Pipe
   |--------------------------------------------------------------------------
   | - Validate incoming request data
   | - Remove unknown fields
   | - Block non-whitelisted fields
   | - Auto transform request types
   |--------------------------------------------------------------------------
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /*
   |--------------------------------------------------------------------------
   | Helmet Security
   |--------------------------------------------------------------------------
   | Adds secure HTTP headers
   | Helps protect against:
   | - Clickjacking
   | - MIME sniffing
   | - Some XSS attacks
   |--------------------------------------------------------------------------
   */
  app.use(helmet());

  /*
   |--------------------------------------------------------------------------
   | Cookie Parser
   |--------------------------------------------------------------------------
   | Parse cookies from request headers
   | Required for:
   | - Refresh Token
   | - Authentication Cookies
   | - Session Handling
   |--------------------------------------------------------------------------
   */
  app.use(cookieParser());

  /*
   |--------------------------------------------------------------------------
   | CORS Configuration
   |--------------------------------------------------------------------------
   | Allow frontend to access backend safely
   |--------------------------------------------------------------------------
   */
  app.enableCors({
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
    credentials: true,
  });

  /*
   |--------------------------------------------------------------------------
   | Start Application
   |--------------------------------------------------------------------------
   */
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Backend server running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

void bootstrap();
