import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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

    @Delete("msg/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteMessage(@Param('id') id: number) {
        this.channelService.deleteMessage(id)
    }

    @Delete("channel/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteChannel(@Param ('id') id: number) {
        this.channelService.deleteChannel(id)
    }

    @Post("new")
    createChannel(@Body() createChannelDTO: CreateChannelDTO) {
        this.channelService.createChannel(createChannelDTO);
    }
}
