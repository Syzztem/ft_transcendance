import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from 'src/dto/create-user.dto';
import FindUserByNameDTO from 'src/dto/find-user-by-name.dto';
import FindUserDTO from 'src/dto/find-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { FriendMessage } from 'src/entities/FriendMessage';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(FriendMessage) private messageRepository: Repository<FriendMessage>) {}

    async getUserByName(dto: FindUserByNameDTO): Promise<User> {
        return this.userRepository.findOne({
            select: {
                id:         true,
                token:      true
            },
            where: {username: dto.username}
        })
    }

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

    async add(createUserDTO: CreateUserDTO) : Promise<User> {
        if (await this.userRepository.count({ where: { username: createUserDTO.username } }) != 0)
            return null;
        const user = this.userRepository.create(createUserDTO);
        return this.userRepository.save(user);
    }

    async delete(id: number) : Promise<number> {
        if (await this.userRepository.countBy({id}) == 0)
            return HttpStatus.NOT_FOUND;
        this.userRepository.delete(id);
        return HttpStatus.OK;
    }

    async sendDM(sendDMDTO: SendDMDTO) : Promise<number> {
        const user1 = await this.userRepository.findOneBy({id: sendDMDTO.id1});
        const user2 = await this.userRepository.findOneBy({id: sendDMDTO.id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.blocked.includes(user2) || user2.blocked.includes(user1))
            return HttpStatus.FORBIDDEN;
        const message = this.messageRepository.create({
            content: sendDMDTO.message,
            sender: user1,
            receiver: user2
        })
        this.messageRepository.save(message)
        return HttpStatus.OK;
    }

    async deleteDM(id: number) : Promise<number> {
        if (await this.messageRepository.countBy({id}) == 0)
            return HttpStatus.NOT_FOUND;
        this.messageRepository.delete(id);
        return HttpStatus.NO_CONTENT;
    }

    async blockUser(id1: number, id2: number) : Promise<number> {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.blocked.includes(user2))
            return HttpStatus.NO_CONTENT;
        user1.blocked.push(user2);
        this.userRepository.save(user1);
    }

    async unBlockUser(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (!user1.blocked.includes(user2))
            return HttpStatus.NO_CONTENT;
        user1.blocked.filter(usr => usr.id !== id2);
        this.userRepository.save(user1);
        return HttpStatus.OK;
    }

    async addFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.friends.includes(user2))
            return HttpStatus.NO_CONTENT;
        if(user1.blocked.includes(user2) || user2.blocked.includes(user1))
            return HttpStatus.FORBIDDEN
        user1.friends.push(user2);
        this.userRepository.save(user2);
        return HttpStatus.OK;
    }

    async removeFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOneBy({id: id1});
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (!user1.friends.includes(user2))
            return HttpStatus.NO_CONTENT;
        user1.friends.filter(usr => usr.id !== user2.id);
        user2.friends.filter(usr => usr.id !== user1.id);
        this.userRepository.save(user1);
        this.userRepository.save(user2);
        return HttpStatus.OK;
    }

}
