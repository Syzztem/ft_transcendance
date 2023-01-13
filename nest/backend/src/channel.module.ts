import { ChannelService } from './services/channel.service';
import { ChannelController } from './controlers/channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { ChannelMessage } from './entities/ChannelMessage';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, ChannelMessage])],
    controllers: [ChannelController,],
    providers: [ChannelService,],
})
export class ChannelModule { }
