import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateChannelDTO from 'src/dto/create-channel.dto';
import GetChannelDTO from 'src/dto/get-channel.dto';
import GetMessageDTO from 'src/dto/get-message.dto';
import PostMessageDTO from 'src/dto/post-message.dto';
import { Channel } from 'src/entities/Channel';
import { ChannelMessage } from 'src/entities/ChannelMessage';
import { ChannelService } from 'src/services/channel.service';

@Controller()
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Get("id")
    getChannel(@Query() getChannelDTO: GetChannelDTO) : Promise<Channel> {
        return this.channelService.getChannelById(getChannelDTO);
    }

    @Get("page")
    getPage(@Query() getMessageDTO: GetMessageDTO) : Promise<ChannelMessage[]> {
        return this.channelService.getMessagePage(getMessageDTO);
    }

    @Get("newmsg")
    newMessage(@Body() postMessageDTO: PostMessageDTO) {
        this.channelService.postMessage(postMessageDTO);
    }

    @Post("new")
    createChannel(@Body() createChannelDTO: CreateChannelDTO) {
        this.channelService.createChannel(createChannelDTO);
    }
}
