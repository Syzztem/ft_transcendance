import { GameModule } from './game.module';
import { ChannelModule } from './channel.module';
import { UserModule } from './user.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CorsMiddleware } from './cors.middlewar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Channel } from './entities/Channel';
import { Game } from './entities/Game';
import { ChannelMessage } from './entities/ChannelMessage';
import { FriendMessage } from './entities/FriendMessage';
import { BanAndMute } from './entities/BanAndMute';
import { MiddlewareBuilder } from '@nestjs/core';

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
      entities: [User, Channel, Game, ChannelMessage, FriendMessage, BanAndMute],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
