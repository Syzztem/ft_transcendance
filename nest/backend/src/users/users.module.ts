import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../database/entities/User';
import { UserService } from './users.service';
import { FriendMessage } from '../database/entities/FriendMessage';

@Module({
    imports: [TypeOrmModule.forFeature([User, FriendMessage])],
    controllers: [UsersController],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule {}
