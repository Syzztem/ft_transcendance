import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateChannelDTO from 'src/dto/create-channel.dto';
import GetChannelDTO from 'src/dto/get-channel.dto';
import GetMessageDTO from 'src/dto/get-message.dto';
import PostMessageDTO from 'src/dto/post-message.dto';
import { Channel } from 'src/entities/Channel';
import { ChannelMessage } from 'src/entities/ChannelMessage';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,
                @InjectRepository(ChannelMessage) private messageRepository: Repository<ChannelMessage>) {}

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

    async postMessage(dto: PostMessageDTO) {
        return this.messageRepository.createQueryBuilder()
        .insert()
        .into(ChannelMessage)
        .values({
            content: dto.message,
            sender: dto.sender,
            channel: dto.channel,
        }).execute();
    }

    async deleteChannel(id: number) {
        if (await this.channelRepository.countBy({id}) == 0)
            return null;
        return this.channelRepository.delete(id);
    }

    async deleteMessage(id: number) {
        if (await this.messageRepository.countBy({id}) == 0)
            return null;
        return this.messageRepository.delete(id)
    }

    async createChannel(dto: CreateChannelDTO) : Promise<Channel>{
        const channel = this.channelRepository.create(dto);
        return this.channelRepository.save(channel);
    }
}
