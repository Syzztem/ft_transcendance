import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateChannelDTO from 'src/dto/create-channel.dto';
import GetChannelDTO from 'src/dto/get-channel.dto';
import GetMessageDTO from 'src/dto/get-message.dto';
import PostMessageDTO from 'src/dto/post-message.dto';
import { BanAndMute } from 'src/entities/BanAndMute';
import { Channel } from 'src/entities/Channel';
import { ChannelMessage } from 'src/entities/ChannelMessage';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,
                @InjectRepository(ChannelMessage) private messageRepository: Repository<ChannelMessage>,
                @InjectRepository(BanAndMute) private bansAndMutesRepository: Repository<BanAndMute>) {}

    async getChannelById(dto: GetChannelDTO) : Promise<Channel> {
        return this.channelRepository.findOne({
            select: {
                name: dto.name
            },
            relations: {
                admin: dto.admin,
                users: dto.users,
                messages: false
            },
            where: {id: dto.id}
        });
    }
    
    async getMessagePage(dto: GetMessageDTO) : Promise<ChannelMessage[]> {
        return this.messageRepository.find({
            select: {
                id:         true,
                content:    true,
                timestamp:  true
            },
            relations: {
                sender:     true,
            },
            where: {channel: {id: dto.channel.id}},
            order: {id: "DESC"},
            take: 50,
            skip: 50 * dto.page
        })
    }

    async postMessage(dto: PostMessageDTO) : Promise<number> {
        const chan: Channel = await this.channelRepository.findOneBy({id: dto.channelId})
        if (!chan) return HttpStatus.NOT_FOUND;
        const user = chan.users.find(user => user.id === dto.senderId);
        if (!user) return HttpStatus.FORBIDDEN;
        this.messageRepository.createQueryBuilder()
        .insert()
        .into(ChannelMessage)
        .values({
            content: dto.message,
            sender: user,
            channel: chan
        }).execute();
        return HttpStatus.OK;
    }

    async banUser(chanId: number, userId: number, date: Date) : Promise<number> {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan) return HttpStatus.NOT_FOUND;
        const user = chan.users.find(user => user.id === userId);
        if (!user) return HttpStatus.NOT_FOUND;
        const banAndMute = this.bansAndMutesRepository.create({
            user: user,
            channel: chan,
            expires: date,
            isBanned: true
        })
        chan.users.filter(usr => usr.id = userId);
        this.channelRepository.save(chan);
        this.bansAndMutesRepository.save(banAndMute);
        return HttpStatus.OK;
    }

    async muteUser(chanId: number, userId: number, date: Date) : Promise<number> {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan) return HttpStatus.NOT_FOUND;
        const user = chan.users.find(user => user.id === userId);
        if (!user) return HttpStatus.NOT_FOUND;
        const banAndMute = this.bansAndMutesRepository.create({
            user: user,
            channel: chan,
            expires: date,
            isBanned: false
        })
        this.channelRepository.save(chan);
        this.bansAndMutesRepository.save(banAndMute);
        return HttpStatus.OK;
    }

    async unBanUser(chanId: number, uid: number) : Promise<number>{
        const ban = await this.bansAndMutesRepository.findOneBy({
            channel: {id: chanId},
            user: {id: uid}
        })
        if (!ban) return HttpStatus.NOT_FOUND;
        this.bansAndMutesRepository.delete(ban.id);
        return HttpStatus.OK;
    }

    async deleteChannel(id: number) : Promise<number> {
        if (await this.channelRepository.countBy({id}) == 0)
            return HttpStatus.NOT_FOUND;
        this.channelRepository.delete(id);
        return HttpStatus.NO_CONTENT;
    }

    async deleteMessage(id: number) : Promise<number> {
        if (await this.messageRepository.countBy({id}) == 0)
            return HttpStatus.NOT_FOUND;
        this.messageRepository.delete(id)
        return HttpStatus.NO_CONTENT;
    }

    async createChannel(dto: CreateChannelDTO) : Promise<Channel>{
        const channel = this.channelRepository.create(dto);
        return this.channelRepository.save(channel);
    }
}
