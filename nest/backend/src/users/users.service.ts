import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from 'src/users/dto/create-user.dto';
import FindUserDTO from 'src/users/dto/find-user.dto';
import ChangeUserDTO from 'src/last_dto/change-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { FriendMessage } from 'src/database/entities/FriendMessage';
import { User } from 'src/database/entities/User';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import * as fs from 'fs';

@Injectable()
export class UserService {
    public static readonly PP_PATH = '/usr/app/profilepics/';

	findOne(token: string) {
		throw new Error('Method not implemented.');
	}

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(FriendMessage) private messageRepository: Repository<FriendMessage>) {}

    async getUserByName(username: string): Promise<User> {
        return this.userRepository.findOne({
            select: {
                id:         true,
                token:      true
            },
            where: {username: username}
        })
    }

    async findOneByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                username: username,
            }
        });
      }

      async findOneById(userId: number): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                id: userId,
            }
        });
      }

    async findByLogin(login: string): Promise<User> {
        return this.userRepository.findOne({
          where: { login42: login }
        });
      }

    async getUserById(id: number): Promise<User> {
        return this.userRepository.findOne({
            select: {
                username:   true,
                rank:       true,
                wins:       false,
                losses:     false,
                level:      true,
            },
            where: {id: id}
        });
    }

    async verifyToken(id: number, token: string) : Promise<number> {
        const user = await this.userRepository.findOneBy({id});
        if (!user) return HttpStatus.NOT_FOUND;
        if (user.verifyToken(token)) return HttpStatus.OK;
        else return HttpStatus.UNAUTHORIZED;
    }

    async add(createUserDTO: CreateUserDTO) : Promise<User> {
        if (createUserDTO.username.length > 8 || createUserDTO.login42.length > 8)
            return null;
        if (createUserDTO.username == 'default') return null;
        if (await this.userRepository.count({ where: { login42: createUserDTO.login42 } }) != 0)
            return null;
        const user = this.userRepository.create(createUserDTO);
        return this.userRepository.save(user);
    }

    async changeUsername(dto: ChangeUserDTO): Promise<number> {
        const user = await this.userRepository.findOneBy({ id: dto.id })

        if (!user) return HttpStatus.NOT_FOUND;
        if (await this.userRepository.count({ where: { username: dto.username } }) != 0)
            return HttpStatus.CONFLICT;
        user.username = dto.username;
        /*******************************
            Crash when username > 8
        ********************************/

        // const oldPath = UserService.PP_PATH + user.login42 + '.jpg';
        // const newPath = UserService.PP_PATH + dto.username + '.jpg';
        // fs.rename(oldPath, newPath, (err) => {
        //     console.log('I am bad developper :', err)
        //     if (err) return HttpStatus.INTERNAL_SERVER_ERROR;
        // })
        await this.userRepository.save(user)
        return HttpStatus.OK;
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

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        this.userRepository.update(
            {id: userId},
            {twoFactorAuthenticationSecret: secret}
        )
      }    

      async turnOnTwoFactorAuthentication(userId: number) {
        this.userRepository.update(
            {id: userId},
            {twofaActivated: true}
        )
      }

    async updateToken(id: number, jwtToken: string){
        this.userRepository.update({id: id}, {token: jwtToken})
    }
}
