import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageGateway } from 'src/gateways/message.gateway';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { FriendMessage } from 'src/database/entities/FriendMessage';
import { Channel } from 'src/database/entities/Channel';
import { JwtService } from '@nestjs/jwt';
import { BanAndMute } from 'src/database/entities/BanAndMute';
import { User } from 'src/database/entities/User';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, ChannelMessage, BanAndMute, User, FriendMessage])],
    controllers: [ChannelController,],
    providers: [ChannelService, MessageGateway, JwtService],
})
export class ChannelModule { }
