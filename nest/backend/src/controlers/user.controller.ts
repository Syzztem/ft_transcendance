import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateUserDTO from 'src/dto/create-user.dto';
import FindUserDTO from 'src/dto/find-user.dto';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get("id")
    getUser(@Query() findUserDTO: FindUserDTO) {
        return this.userService.getUserById(findUserDTO);
    }

    @Post("new")
    newUser(@Body() createUserDTO: CreateUserDTO) {
        this.userService.add(createUserDTO);
    }
}
