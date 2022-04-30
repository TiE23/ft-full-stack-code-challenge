import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(
  app: INestApplication,
  globalPrefix: string
): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
}
