import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from 'src/dto/create-user.dto';
import FindUserDTO from 'src/dto/find-user.dto';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

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
                channels:   dto.channels,
                games:      dto.games
            },
            where: {id: dto.id}
        });
    }

    async add(createUserDTO: CreateUserDTO) {
        this.userRepository.create(createUserDTO);
    }

}
