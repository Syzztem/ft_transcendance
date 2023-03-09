import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {cors: true});
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  })
  await app.listen(3000);
}
bootstrap();  