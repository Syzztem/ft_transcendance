import { GameModule } from './game.module';
import { ChannelModule } from './channel.module';
import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Channel } from './entities/Channel';
import { Game } from './entities/Game';
import { ChannelMessage } from './entities/ChannelMessage';
import { FriendMessage } from './entities/FriendMessage';

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
      entities: [User, Channel, Game, ChannelMessage, FriendMessage],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
