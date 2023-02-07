import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Response } from '@nestjs/common';
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
    async getChannel(@Query() getChannelDTO: GetChannelDTO,
                     @Response() res : any) : Promise<Channel> {
        const channel = await this.channelService.getChannelById(getChannelDTO);
        if (!channel) return res.status(HttpStatus.NOT_FOUND).send();
        return channel;
    }

    @Get("page")
    async getPage(@Query() getMessageDTO: GetMessageDTO,
                  @Response() res : any) : Promise<ChannelMessage[]> {
        const messages = await this.channelService.getMessagePage(getMessageDTO);
        if (!messages) return res.status(HttpStatus.NOT_FOUND).send();
        return messages;
    }

    @Post("newmsg")
    async newMessage(@Body() postMessageDTO: PostMessageDTO,
                    @Response() res : any) {
        res.status(await this.channelService.postMessage(postMessageDTO)).send();
    }

    @Post("join/:chanId:/uid")
    async joinChannel(@Param('chanId') chanId: number,
                      @Param('uid') uid:number,
                      @Response() res: any) {
        res.status(await this.channelService.joinChannel(chanId, uid)).send();
    }

    @Post("joinwithpassword/:chanId:/uid")
    async joinWithPassword( @Param('chanId') chanId: number,
                            @Param('uid') uid: number,
                            @Body() password: string,
                            @Response() res:any) {
        res.status(await this.channelService.joinChannelWithPassword(chanId, uid, password)).send();
    }

    @Patch("leave/:chanId:/uid")
    async leaveChannel(@Param('chanId') chanId: number,
                      @Param('uid') uid:number,
                      @Response() res: any) {
        res.status(await this.channelService.leaveChannel(chanId, uid)).send();
    }

    @Patch("ban/:chanId/:uid/:date")
    async banUser(@Param('chanId') chanId: number,
                  @Param('uid') uid:number,
                  @Param('date') date: Date,
                  @Response() res: any) {
        res.status(await this.channelService.banUser(chanId, uid, date)).send();
    }

    @Patch("mute/:chanId/:uid/:date")
    async muteUser(@Param('chanId') chanId: number,
                   @Param('uid') uid:number,
                   @Param('date') date: Date,
                   @Response() res: any) {
        res.status(await this.channelService.muteUser(chanId, uid, date)).send();
    }

    @Patch("unban/:chanId/:uid")
    async unBanUser(@Param('chanId') chanId:number, 
                    @Param('uid') uid:number,
                    @Response() res : any) {
        res.status(await this.channelService.unBanUser(chanId, uid)).send();
    }

    @Delete("msg/:id")
    async deleteMessage(@Param('id') id: number,
                        @Response() res : any) {
        res.status(await this.channelService.deleteMessage(id)).send();
    }

    @Delete(":id")
    async deleteChannel(@Param ('id') id: number,
                        @Response() res : any) {
        res.status(await this.channelService.deleteChannel(id)).send();
    }

    @Post("new")
    @HttpCode(HttpStatus.OK)
    createChannel(@Body() createChannelDTO: CreateChannelDTO) {
        this.channelService.createChannel(createChannelDTO);
    }
}
