import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from './dto/create-user.dto';
import FindUserDTO from './dto/find-user.dto';
import { User } from '../database/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
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
