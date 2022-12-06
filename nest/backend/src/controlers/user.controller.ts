/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post()
    create() {
        return this.userService.add
    }
}
