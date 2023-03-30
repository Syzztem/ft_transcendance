import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../database/entities/User';
import { UserService } from './users.service';
import { FriendMessage } from '../database/entities/FriendMessage';
import { Channel } from 'src/database/entities/Channel';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { BanAndMute } from 'src/database/entities/BanAndMute';
import { JwtService } from '@nestjs/jwt';
import { Game } from 'src/database/entities/Game';

@Module({
    imports: [TypeOrmModule.forFeature([User, FriendMessage, Channel, ChannelMessage, BanAndMute, Game])],
    controllers: [UsersController],
    providers: [UserService, JwtService],
    exports: [UserService],
})
export class UsersModule {}
