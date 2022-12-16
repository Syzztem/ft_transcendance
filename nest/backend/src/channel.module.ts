import { ChannelService } from './services/channel.service';
import { ChannelController } from './controlers/channel.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
    controllers: [ChannelController,],
    providers: [ChannelService,],
})
export class ChannelModule { }
