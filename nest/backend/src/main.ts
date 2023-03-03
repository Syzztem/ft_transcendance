import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
var cors = require('cors')

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors()
  // app.use(cors())
  await app.listen(3000);
}
bootstrap();  