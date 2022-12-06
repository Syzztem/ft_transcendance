import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    getUserById(id: number): Promise<User> {
        return this.userRepository.findOneBy({id});
    }

    add(user: User) {
        this.userRepository.create(user);
    }
}
