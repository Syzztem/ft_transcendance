import { ChannelService } from './services/channel.service';
import { ChannelController } from './controlers/channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { ChannelMessage } from './entities/ChannelMessage';
import { BanAndMute } from './entities/BanAndMute';
import { User } from './entities/User';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, ChannelMessage, BanAndMute, User])],
    controllers: [ChannelController,],
    providers: [ChannelService,],
})
export class ChannelModule { }
