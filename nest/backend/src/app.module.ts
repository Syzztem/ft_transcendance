import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { ChannelModule } from './channel/channel.module';
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

import { User } from './database/entities/User';
import { Channel } from './database/entities/Channel';
import { Game } from './database/entities/Game';
import { ChannelMessage } from './database/entities/ChannelMessage';
import { FriendMessage } from './database/entities/FriendMessage';
import { BanAndMute } from './database/entities/BanAndMute';

@Module({
  imports: [PassportModule, AuthModule, UsersModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
    UsersModule,
    GameModule,
    ChannelModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PW,
      database: process.env.POSTGRES_DB,
      entities: [User, Channel, Game, ChannelMessage, FriendMessage, BanAndMute],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
