import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from 'src/users/dto/create-user.dto';
import FindUserDTO from 'src/users/dto/find-user.dto';
import ChangeUserDTO from './dto/change-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { FriendMessage } from 'src/database/entities/FriendMessage';
import { User } from 'src/database/entities/User';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Game } from 'src/database/entities/Game';
import { Equal } from 'typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
    public static readonly PP_PATH = '/usr/app/profilepics/';

	findOne(token: string) {
		throw new Error('Method not implemented.');
	}

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(FriendMessage) private messageRepository: Repository<FriendMessage>,
                @InjectRepository(Game) private gameRepository: Repository<Game>) {}

    async getUserByName(username: string): Promise<User> {
        return this.userRepository.findOne({
            select: {
                id:         true,
                token:      true
            },
            where: {username: username}
        })
    }

    async userExists(id: number) : Promise<boolean>{
        return await this.userRepository.countBy({id}) != 0;
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

    async getUserById(dto: FindUserDTO): Promise<User> {
        return this.userRepository.findOne({
            select : {
                username: dto.username,
                login42: dto.login42,
                email: dto.email,
                profilePic: dto.profilePic,
                rank: dto.rank,
                wins: dto.winslosses,
                losses: dto.winslosses,
                level: dto.level,
                friends: dto.friends
            },
            relations: {
                channels: dto.channels,
                games: dto.games,
                games2: dto.games,
                friends: dto.friends
            },
            where: {id: dto.id}
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

    verifUsername(username: string) {
        if (username.length === 0)
            return false
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        const firstCharRegex = /^[a-zA-Z]/;
        return alphanumericRegex.test(username) && firstCharRegex.test(username.charAt(0));
    }

    async changeUsername(dto: ChangeUserDTO): Promise<number> {
        const user = await this.userRepository.findOneBy({ id: dto.id });
        if (!user)
          return HttpStatus.NOT_FOUND;
        if (
          (await this.userRepository.count({ where: { username: dto.username } })) != 0 || dto.username.length > 8 || !this.verifUsername(dto.username)
        ) {
          return HttpStatus.CONFLICT;
        }
        const oldUsername = user.username;
        user.username = dto.username;
      
        if (oldUsername && oldUsername.trim() !== '') {
          const oldPath = UserService.PP_PATH + oldUsername + ".jpg";
          const newPath = UserService.PP_PATH + dto.username + ".jpg";
      
          if (fs.existsSync(oldPath)) {
            try {
              await new Promise<void>((resolve, reject) => {
                fs.rename(oldPath, newPath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
            } catch (err) {
              Logger.error(`Failed to rename file: ${err.message}`, err.stack, 'changeUsername');
            }
          } else {
            Logger.warn(`Source file does not exist: ${oldPath}`, 'changeUsername');
          }
        }
      
        await this.userRepository.save(user);
        return HttpStatus.OK;
      }

    async delete(id: number) : Promise<number> {
        if (await this.userRepository.countBy({id}) == 0)
            return HttpStatus.NOT_FOUND;
        this.userRepository.delete(id);
        return HttpStatus.OK;
    }

    async get2FAsecret(id: number) : Promise<string> {
        const user = await this.userRepository.findOne({
            select: {twoFactorAuthenticationSecret: true},
            where: {id: id}
        });
        return user.twoFactorAuthenticationSecret;
    }

    async sendDM(sendDMDTO: SendDMDTO) : Promise<number> {
        const user1 = await this.userRepository.findOneBy({id: sendDMDTO.id1});
        const user2 = await this.userRepository.findOneBy({id: sendDMDTO.id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.isBlocked(user2) || user2.isBlocked(user1))
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
        const user1 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                blocked: true,
                friends: true
            },
            where: {id: id1}
        });
        const user2 = await this.userRepository.findOneBy({id: id2});
        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.isBlocked(user2))
            return HttpStatus.NO_CONTENT;
        user1.blocked.push(user2);
        user1.friends.filter(usr => usr.id !== user2.id);
        user2.friends.filter(usr => usr.id !== user1.id);
        this.userRepository.save(user1);
        this.userRepository.save(user2);
    }

    async unBlockUser(id1: number, id2: number) {
        const user1 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                blocked: true
            },
            where: {id: id1}
        });
        const user2 = await this.userRepository.findOneBy({id: id2});

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (!user1.isBlocked(user2))
            return HttpStatus.NO_CONTENT;
        user1.blocked.filter(usr => usr.id !== id2);
        this.userRepository.save(user1);
        return HttpStatus.OK;
    }

    async addFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                blocked: true,
                friends: true
            },
            where: {id: id1}
        });
        const user2 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                blocked: true,
                friends: true,
            },
            where: {id: id2}
        });

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (user1.isFriend(user2))
            return HttpStatus.NO_CONTENT;
        if(user1.isBlocked(user2) || user2.isBlocked(user1))
            return HttpStatus.FORBIDDEN
        user1.friends.push(user2);
        this.userRepository.save(user2);
        console.log(this.userRepository.findOneBy({id: id1}))
        return HttpStatus.OK;
    }

    async removeFriend(id1: number, id2: number) {
        const user1 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                friends: true
            },
            where: {id: id1}
        });
        const user2 = await this.userRepository.findOne({
            select: {
                id: true
            },
            relations: {
                friends: true
            },
            where: {id: id2}
        });

        if (!user1 || !user2) return HttpStatus.NOT_FOUND;
        if (!user1.isFriend(user2))
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
            {isTwoFactorAuthenticationEnabled: true}
        )
    }

    async turnOffTwoFactorAuthentication(userId: number) {
        this.userRepository.update(
            {id: userId},
            {isTwoFactorAuthenticationEnabled: false}
        )
    }

    async updateLastSuccessfulAuth(userId: number, lastSuccessfulAuth: Date) {
        const user = await this.userRepository.findOneBy({id: userId})
        user.lastSuccessfulAuth = lastSuccessfulAuth
        await this.userRepository.save(user)
      }

    async updateToken(id: number, jwtToken: string){
        await this.userRepository.update({id: id}, {token: jwtToken})
    }

    async update2fa(id: number, twofa: boolean) {
        await this.userRepository.update({id: id}, {TwoFactorAuthenticated: twofa})
    }

    // async updateOTP(id: number, secret?: string) {
    //     const user = await this.getUserById(id)
    //     try {
    //         console.log("secret: ", secret)
    //         await this.userRepository.update(user.id, {twoFactorAuthenticationSecret: secret})
    //     } catch (error: any) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    //     }
    // }

    async incrementWins(userId: number) {
        this.userRepository.increment({id: userId}, 'wins', 1)
    }

    async incrementLosses(userId: number) {
        this.userRepository.increment({id: userId}, 'losses', 1)
    }

    async getUserGameHistory(user: User){
        let game: Game[] = await this.gameRepository.find({
            where: [
                { player1: Equal(user)},
                { player2: Equal(user) },
            ]
        })
        return game
    }
}
