import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { MessageGateway } from 'src/gateways/message.gateway';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { BanAndMute } from 'src/database/entities/BanAndMute';
import { User } from 'src/database/entities/User';
import { FriendMessage } from 'src/database/entities/FriendMessage';

@Module({
    imports: [TypeOrmModule.forFeature([User, FriendMessage, Channel, ChannelMessage, BanAndMute])],
    controllers: [ChannelController,],
    providers: [ChannelService, MessageGateway],
})
export class ChannelModule { }
