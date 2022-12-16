import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateChannelDTO from 'src/dto/create-channel.dto';
import GetChannelDTO from 'src/dto/get-channel.dto';
import { Channel } from 'src/entities/Channel';
import { ChannelService } from 'src/services/channel.service';

@Controller()
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Get("id")
    getChannel(@Query() getChannelDTO: GetChannelDTO) : Promise<Channel> {
        return this.channelService.getChannelById(getChannelDTO);
    }

    @Post("new")
    createChannel(@Body() createChannelDTO: CreateChannelDTO) {
        this.channelService.createChannel(createChannelDTO);
    }
}
