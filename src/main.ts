import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform will allow
      whitelist: true, // This removes any extra fields the client sends that are not defined in your DTO.
      forbidNonWhitelisted: false, // Extra fields are silently removed that is not in dto.
    }),
  );
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
