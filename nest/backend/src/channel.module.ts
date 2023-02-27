import { ChannelService } from './services/channel.service';
import { ChannelController } from './controlers/channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { ChannelMessage } from './entities/ChannelMessage';
import { BanAndMute } from './entities/BanAndMute';
import { User } from './entities/User';
import { UserService } from './services/user.service';
import { FriendMessage } from './entities/FriendMessage';
import { Repository } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, ChannelMessage, BanAndMute, User, FriendMessage])],
    controllers: [ChannelController,],
    providers: [ChannelService, UserService],
})
export class ChannelModule { }
