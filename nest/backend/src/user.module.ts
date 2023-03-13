import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controlers/user.controller';
import { FriendMessage } from './entities/FriendMessage';
import { User } from './entities/User';
import { MessageGateway } from './gateways/message.gateway';
import { UserService } from './services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, FriendMessage])],
    controllers: [UserController],
    providers: [UserService, MessageGateway]
})
export class UserModule {}
