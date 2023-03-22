import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateChannelDTO from 'src/channel/dto/create-channel.dto';
import GetChannelDTO from 'src/channel/dto/get-channel.dto';
import GetMessageDTO from 'src/dto/get-message.dto';
import PostMessageDTO from 'src/dto/post-message.dto';
import { BanAndMute } from 'src/database/entities/BanAndMute';
import { Channel } from 'src/database/entities/Channel';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { User } from 'src/database/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,
                @InjectRepository(ChannelMessage) private messageRepository: Repository<ChannelMessage>,
                @InjectRepository(BanAndMute) private bansAndMutesRepository: Repository<BanAndMute>,
                @InjectRepository(User) private userRepository: Repository<User>) {}

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
            where: {channel: {id: dto.channelId}},
            order: {id: "DESC"},
            take: 50,
            skip: 50 * dto.page
        })
    }

    async postMessage(dto: PostMessageDTO) : Promise<number> {
        const chan: Channel = await this.channelRepository.findOneBy({id: dto.channelId})
        if (!chan)
            return HttpStatus.NOT_FOUND;
        const user = chan.users.find(user => user.id === dto.senderId);
        if (!user || chan.isMuted(dto.senderId))
            return HttpStatus.FORBIDDEN;
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
        if (!chan)
            return HttpStatus.NOT_FOUND;
        if (chan.isBanned(userId))
            return HttpStatus.NO_CONTENT;
        const user = chan.users.find(user => user.id === userId);
        if (!user)
            return HttpStatus.NOT_FOUND;
        const banAndMute = this.bansAndMutesRepository.create({
            user: user,
            channel: chan,
            expires: date,
            isBanned: true
        })
        chan.removeUser(userId);
        this.channelRepository.save(chan);
        this.bansAndMutesRepository.save(banAndMute);
        return HttpStatus.OK;
    }

    async muteUser(chanId: number, userId: number, date: Date) : Promise<number> {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan)
            return HttpStatus.NOT_FOUND;
        const user = chan.users.find(user => user.id === userId);
        if (!user) 
            return HttpStatus.NOT_FOUND;
        if (chan.isMuted(userId)) return HttpStatus.NO_CONTENT;
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
        });
        if (!ban)
            return HttpStatus.NOT_FOUND;
        this.bansAndMutesRepository.delete(ban.id);
        return HttpStatus.OK;
    }

    async joinChannel(chanId: number, uid: number) : Promise<number> {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan)
            return HttpStatus.NOT_FOUND;
        const user = await this.userRepository.findOneBy({id: uid});
        if (!user)
            return HttpStatus.NOT_FOUND;
        if(chan.isBanned(uid))
            return HttpStatus.FORBIDDEN;
        if (chan.password != null)
            return HttpStatus.UNAUTHORIZED;
        chan.users.push(user);
        return HttpStatus.OK;
    }

    async joinChannelWithPassword(chanId: number, uid: number, password: string) {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan)
            return HttpStatus.NOT_FOUND;
        const user = await this.userRepository.findOneBy({id: uid});
        if (!user)
            return HttpStatus.NOT_FOUND;
        if (chan.password == null)
            return HttpStatus.BAD_REQUEST;
        if(chan.isBanned(uid))
            return HttpStatus.FORBIDDEN;
        if (!await chan.verifyPassword(password))
            return HttpStatus.UNAUTHORIZED;
        chan.users.push(user);
        return HttpStatus.OK;
    }

    async leaveChannel(chanId: number, uid: number) : Promise<number> {
        const chan = await this.channelRepository.findOneBy({id: chanId});
        if (!chan || !chan.removeUser(uid))
            return HttpStatus.NOT_FOUND;
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
        const user = await this.userRepository.findOneBy({id: dto.adminId});
        if (!user) return null;
        const channel = this.channelRepository.create();
        channel.name = dto.name;
        channel.admin = user;
        channel.users = [user];
        channel.password = dto.password;
        channel.isPrivate = dto.password == null ? false : true;
        return await this.channelRepository.save(channel);
    }
}
