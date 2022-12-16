import { GameModule } from './game.module';
import { ChannelModule } from './channel.module';
import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserController } from './controlers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    GameModule,
    ChannelModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PW,
      database: process.env.POSTGRES_DB,
      entities: ["entities/*.ts"],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
