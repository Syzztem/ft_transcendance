import { BadRequestException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import PostMessageDTO from 'src/dto/post-message.dto';
import { Repository } from 'typeorm';
import GetMessageDTO from 'src/dto/get-message.dto';
import { JoinChannelDTO } from '../dto/join-channel.dto';
import { BanUserDTO } from '../dto/ban-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { Channel } from 'src/database/entities/Channel';
import { BanAndMute } from 'src/database/entities/BanAndMute';
import { User } from 'src/database/entities/User';
import { FriendMessage } from 'src/database/entities/FriendMessage';
import CreateChannelDTO from 'src/channel/dto/create-channel.dto';
import { ChannelMessage } from 'src/database/entities/ChannelMessage';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
    
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,                
                @InjectRepository(ChannelMessage) private messageRepository: Repository<ChannelMessage>,
                @InjectRepository(BanAndMute) private bansAndMutesRepository: Repository<BanAndMute>,
                @InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(FriendMessage) private usrmessageRepository: Repository<FriendMessage>,
                private jwtService: JwtService) {}
                
    @WebSocketServer()
    server: Server;

    private clients = new Map<number, Socket>();
    private sockets = new Map<Socket, number>();

    private verifyId(client: Socket, id: number) {
        if (this.sockets.get(client) != id) {
            throw new BadRequestException("Nice try");
        }
    }

    @SubscribeMessage('newmsg')
    async handleMessage(@MessageBody() dto: PostMessageDTO,
                        @ConnectedSocket() client: Socket) {
        //this.verifyId(client, dto.senderId);
        const chan: Channel = await this.channelRepository.findOneBy({id: dto.channelId})
        if (!chan)
            throw new BadRequestException("Channel Doesn't exist")
        const user = chan.users.find(user => user.id === dto.senderId);
        if (!user || chan.isMuted(dto.senderId))
            throw new BadRequestException("User doesn't exist, is not on this channel or is muted");
        this.server.to(chan.id.toString()).emit(user.username + "@" + chan.id + ":" + dto.message);
        const message = this.messageRepository.create({
            content: dto.message,
            sender: user,
            channel: chan
        })
        this.messageRepository.save(message);
    }

    @SubscribeMessage('join')
    async joinChannel(  @MessageBody() dto: JoinChannelDTO,
                        @ConnectedSocket() client: Socket) {
        this.verifyId(client, dto.uid);
        const chan = await this.channelRepository.findOneBy({id: dto.chanId});
        if (!chan)
            throw new BadRequestException("Channel Doesn't exist")
        const user = await this.userRepository.findOneBy({id: dto.uid});
        if (!user)
            throw new BadRequestException("User doesn't exist");
        if(chan.isBanned(dto.uid))
            throw new BadRequestException("User is banned from this channel");
        if (chan.password != null)
            throw new BadRequestException("This channel requires a password");
        client.join(chan.id.toString());
        chan.users.push(user);
        this.channelRepository.save(chan);
        client.emit(JSON.stringify(chan));
    }

    @SubscribeMessage('search')
    async searchChannel(@MessageBody() query: string) {
        return this.channelRepository.createQueryBuilder()
            .select("*")
            .where('name ILIKE :query', {query: `%${query}%`})
            .getMany();
    }

    @SubscribeMessage('joinwithpw')
    async joinChannelWithPassword(  @MessageBody() dto: JoinChannelDTO,
                        @ConnectedSocket() client: Socket) {
        this.verifyId(client, dto.uid);
        const chan = await this.channelRepository.findOneBy({id: dto.chanId});
        if (!chan)
            throw new BadRequestException("Channel Doesn't exist")
        const user = await this.userRepository.findOneBy({id: dto.uid});
        if (!user)
            throw new BadRequestException("User doesn't exist");
        if(chan.isBanned(dto.uid))
            throw new BadRequestException("User is banned from this channel");
        if (!chan.verifyPassword(dto.password))
            throw new BadRequestException("Wrong Password");
        client.join(chan.id.toString());
        chan.users.push(user);
        this.channelRepository.save(chan);
        client.emit(JSON.stringify(chan));
    }

    @SubscribeMessage('ban')
    async banUser(  @MessageBody() dto: BanUserDTO,
                    @ConnectedSocket() client: Socket) {
        const chan = await this.channelRepository.findOneBy({id: dto.chanId});
        if (!chan)
            throw new BadRequestException("Channel Doesn't exist");
        if (chan.admin.id != this.sockets.get(client))
            throw new BadRequestException("Nice try");
        const user = chan.users.find(user => user.id === dto.uid);
        if (!user)
            throw new BadRequestException("User doesn't exist or is not on this channel");
        if (dto.isBan) {
            const bndclient = this.clients.get(dto.uid);
            bndclient.emit("/" + chan.id + ":You were banned from this channel");
            client.emit(user.username + " was banned");
            bndclient.leave(chan.id.toString());
            chan.removeUser(dto.uid);
            this.channelRepository.save(chan);
        }
        const banAndMute = this.bansAndMutesRepository.create({
            user: user,
            channel: chan,
            expires: dto.date,
            isBanned: dto.isBan
        });
        this.bansAndMutesRepository.save(banAndMute);
    }

    @SubscribeMessage('getmsg')
    async getMessagePage(   @MessageBody() dto: GetMessageDTO,
                            @ConnectedSocket() client: Socket) {
        if (!client.in(dto.channelId.toString()))
            throw new BadRequestException("Nice try");
        const messages = await this.messageRepository.find({
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
        client.emit(messages.toString());
    }

    @SubscribeMessage('unban')
    async unBanUser(@MessageBody() dto: JoinChannelDTO,
                    @ConnectedSocket() client: Socket) {
        const chan = await this.channelRepository.findOneBy({id: dto.chanId});
        const user = await this.userRepository.findOneBy({id : dto.uid});
        if (!chan || !user)
            throw new BadRequestException("Channel or user doesn't exist");
        if (chan.admin.id != this.sockets.get(client))
            throw new BadRequestException("Nice try");
        const ban = await this.bansAndMutesRepository.findOneBy({
            channel: {id: dto.chanId},
            user: {id: dto.uid}
        });
        client.emit(user.username + " was unbanned");
        if (!ban)
            throw new BadRequestException("User or channel doesn't exist or user is nor banned or muted from this channel");
        this.bansAndMutesRepository.delete(ban.id);
    }

    @SubscribeMessage('delete')
    async deleteChannel(@MessageBody() id: number,
                        @ConnectedSocket() client: Socket) {
        const chan = await this.channelRepository.findOneBy({id})
        if (!chan)
            throw new BadRequestException("Channel doesn't exist");
        if (chan.admin.id != this.sockets.get(client))
            throw new BadRequestException("Nice try");
        this.server.to(chan.id.toString()).emit("/" + chan.id + ":Channel was deleted");
        this.server.socketsLeave(chan.id.toString());
        this.channelRepository.delete(id);
    }
                                                      
    @SubscribeMessage('create')
    async createChannel(@MessageBody() dto: CreateChannelDTO,
                        @ConnectedSocket() client: Socket) {
        this.verifyId(client, dto.adminId);
        let channel = this.channelRepository.create();
        const user = await this.userRepository.findOneBy({id: dto.adminId});
        if (!user)
            throw new BadRequestException("User doesn't exist");
        channel.name = dto.name;
        channel.admin = user;
        channel.users = [user];
        channel.password = dto.password;
        channel.isPrivate = dto.password == null ? false : true;
        channel = await this.channelRepository.save(channel);
        client.join(channel.id.toString());
        client.emit(JSON.stringify(channel));
    }

    @SubscribeMessage('leave')
    async leaveChannel( @MessageBody() dto: JoinChannelDTO,
                        @ConnectedSocket() client: Socket) {
        this.verifyId(client, dto.uid);
        const chan = await this.channelRepository.findOneBy({id: dto.chanId});
        client.emit("/" + chan.id + ":You left this channel");
        client.leave(chan.id.toString());
        if (!chan || !chan.removeUser(dto.uid))
            throw new BadRequestException("Channel doesn't exist or user doesn't exist or is not on this channel");
        this.channelRepository.save(chan);
    }

    @SubscribeMessage('deletemsg')
    async deleteMessage(@MessageBody() id: number,
                        @ConnectedSocket() client: Socket) {
        const message = await this.messageRepository.findOneBy({id});
        const clientid = this.sockets.get(client);
        if (!message)
            throw new BadRequestException("Message doesn't exist");
        if (message.sender.id != clientid && message.channel.admin.id != clientid)
            throw new BadRequestException("Nice try");
        this.server.to(message.channel.id.toString()).emit("!" + id);
        this.messageRepository.delete(id)
        return HttpStatus.NO_CONTENT;
    }

    @SubscribeMessage('sendDM')
    async sendDM(   @MessageBody() dto : SendDMDTO,
                    @ConnectedSocket() client: Socket) {
        this.verifyId(client, dto.id1);
        const user1 = await this.userRepository.findOneBy({id: dto.id1});
        const user2 = await this.userRepository.findOneBy({id: dto.id2});

        if (!user1 || !user2)
            return HttpStatus.NOT_FOUND;
        if (user1.blocked.includes(user2) || user2.blocked.includes(user1))
            throw new BadRequestException("Users blocked each other");
        const socket = this.clients.get(user2.id);
        client.emit(user1.username + ":" + dto.message)
        if (socket) socket.emit(user1.username + ":" + dto.message)
        const message = this.usrmessageRepository.create({
            content: dto.message,
            sender: user1,
            receiver: user2
        })
        this.messageRepository.save(message)
        return HttpStatus.OK;
    }

    @SubscribeMessage('deleteDM')
    async deleteDM( @MessageBody() id: number,
                    @ConnectedSocket() client: Socket) {
        const message = await this.usrmessageRepository.findOneBy({id});
        const recvsocket = this.clients.get(message.receiver.id);
        if (!message || message.sender.id != this.sockets.get(client))
            throw new BadRequestException("message dosn't exist or does not belong to the person who deleted it");
        client.emit("!" + id);
        if (recvsocket) recvsocket.emit("!" + id);
        this.messageRepository.delete(id);

    }

    @SubscribeMessage('addFriend')
    async addFriend(@MessageBody() ids: number[],
                    @ConnectedSocket() client: Socket) {
        this.verifyId(client, ids[0]);
        const user1 = await this.userRepository.findOneBy({id: ids[0]});
        const user2 = await this.userRepository.findOneBy({id: ids[1]});

        if (!user1 || !user2) throw new BadRequestException("One or more of the users doesn't exist");
        if (user1.friends.includes(user2))
            return ;
        if(user1.blocked.includes(user2) || user2.blocked.includes(user1))
            throw new BadRequestException("Users blocked each other");
        this.clients.get(ids[1]).emit("+" + ids[0]);
        this.clients.get(ids[0]).emit("+" + ids[1]);
        user1.friends.push(user2);
        this.userRepository.save(user2);
    }


    async handleConnection(client: Socket) {
        const uid: number = this.jwtService.decode(client.handshake.auth.token).sub;
        const user = await this.userRepository.findOne({
            select: {
                id: true,
                channels: true
            },
            where: {id: uid}
        });
        if(!user)
            client.disconnect();
        // client.emit(user.channels.toString());
        this.clients.set(user.id, client);
        this.sockets.set(client, user.id);
        // client.join(user.channels.map(chan => chan.id.toString()));
        console.log('User connected');
    }

    async handleDisconnect(client: Socket) {
        this.clients.delete(this.sockets.get(client));
        this.sockets.delete(client);
        client.disconnect();
        console.log('User disconnected');
    }

    afterInit(server: any) {
        console.log('Socket is live')
    }
}
