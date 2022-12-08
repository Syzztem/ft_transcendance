import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Auth } from 'googleapis';
import { ftStrategy } from './auth/strategies/ft.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [PassportModule, AuthModule, UsersModule, ConfigModule.forRoot({
    // envFilePath: '../../../.env',
})],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
