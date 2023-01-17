import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AddFriendDTO from 'src/dto/add-friend.dto';
import CreateUserDTO from 'src/dto/create-user.dto';
import FindUserDTO from 'src/dto/find-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { FriendMessage } from 'src/entities/FriendMessage';
import { User } from 'src/entities/User';
import { DeleteDateColumn, QueryFailedError, Repository } from 'typeorm';
import { threadId } from 'worker_threads';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(FriendMessage) private messageRepository: Repository<FriendMessage>) {}

    async getUserById(dto: FindUserDTO): Promise<User> {
        return this.userRepository.findOne({
            select: {
                username:   dto.username,
                rank:       dto.rank,
                wins:       dto.winsLosses,
                losses:     dto.winsLosses,
                level:      dto.level,
            },
            relations: {
                friends:    dto.friends,
                blocked:    true,
                channels:   dto.channels,
                games:      dto.games
            },
            where: {id: dto.id}
        });
    }

    async delete(id: number) {
        if (await this.userRepository.countBy({id}) == 0)
            return null;
        return this.userRepository.delete(id);
    }

    async sendDM(sendDMDTO: SendDMDTO) {
        const user1 = await this.userRepository.findOneBy({id: sendDMDTO.id1});
        const user2 = await this.userRepository.findOneBy({id: sendDMDTO.id2});

        if (user1.blocked.includes(user2) || user2.blocked.includes(user1))
            return null;
        this.messageRepository.create({
            content: sendDMDTO.message,
            sender: user1,
            receiver: user2
        })
    }

    async deleteDM(id: number) {
        if (await this.messageRepository.countBy({id}) == 0)
            return null;
        this.messageRepository.delete(id);
    }

    async blockUser(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (user1.blocked.includes(user2))
            return null;
        user1.blocked.push(user2);
        this.userRepository.save(user1);
    }

    async unBlockUser(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1.blocked.includes(user2))
            return null;
        user1.blocked.filter(usr => usr.id !== id2);
        this.userRepository.save(user1);
    }

    async addFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});
        if (user1.friends.includes(user2))
            return null;
        user1.friends.push(user2);
        user2.friends.push(user1);
        this.userRepository.save(user1);
        this.userRepository.save(user2);
        return 1;
    }

    async removeFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});
        if (!user1.friends.includes(user2))
            return null;
        user1.friends.filter(usr => usr.id !== user2.id);
        user2.friends.filter(usr => usr.id !== user1.id);
        this.userRepository.save(user1);
        this.userRepository.save(user2);
        return 1;
    }
    
    async add(createUserDTO: CreateUserDTO) : Promise<User> {
        if (await this.userRepository.count({ where: { username: createUserDTO.username } }) != 0)
            return null;
        const user = this.userRepository.create(createUserDTO);
        return this.userRepository.save(user);
    }

    async getUserByName(name: string): Promise<User> {
        return this.userRepository.findOne({
            select: {
                id:         true,
                username:   true
            },
            where: {username: name}
        })
    }

}
