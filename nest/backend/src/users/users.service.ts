import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDTO from 'src/users/dto/create-user.dto';
import FindUserDTO from './dto/find-user.dto';
import { User } from 'src/database/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    getUserById(dto: FindUserDTO): Promise<User> {
        return this.userRepository.findOne({
            select: {
                username:   dto.username,
                rank:       dto.rank,
                wins:       dto.winsLosses,
                losses:     dto.winsLosses,
                level:      dto.level,
                friends:    dto.friends,
                games:      dto.games
            },
            where: {id: dto.id}
        });
    }

    add(createUserDTO: CreateUserDTO) {
        this.userRepository.create(createUserDTO);
    }

}
