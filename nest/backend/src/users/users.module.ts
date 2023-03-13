import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../database/entities/User';
import { UserService } from './users.service';
import { FriendMessage } from '../database/entities/FriendMessage';
import { MessageGateway } from 'src/gateways/message.gateway';
import { Channel } from 'src/database/entities/Channel';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { BanAndMute } from 'src/database/entities/BanAndMute';

@Module({
    imports: [TypeOrmModule.forFeature([User, FriendMessage, Channel, ChannelMessage, BanAndMute])],
    controllers: [UsersController],
    providers: [UserService, MessageGateway],
    exports: [UserService],
})
export class UsersModule {}
