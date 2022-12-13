import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ftStrategy } from './auth/strategies/ft.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';


@Module({
  imports: [PassportModule, AuthModule, UsersModule, ConfigModule.forRoot({
    envFilePath: '../.env',
    isGlobal: true,
  }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRE_HOST,
      port: 5432,
      username: process.env.POSTGRE_USER,
      password: process.env.POSTGRE_PW,
      database: process.env.POSTGRE_DB,
      entities: ["./database/entities/*.ts"],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
