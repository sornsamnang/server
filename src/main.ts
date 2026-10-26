import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*", // Your frontend URL (Do NOT use "*")
    credentials: true, // This sets Access-Control-Allow-Credentials to true
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Strips away properties that do not have validation decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true,            // Automatically transforms payloads to match DTO class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
