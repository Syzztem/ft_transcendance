import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import FindUserDTO from './dto/find-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get("id")
    async getUser(@Query() findUserDTO: FindUserDTO) {
        this.userService.getUserById(findUserDTO);
    }

    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO) {
        this.userService.add(createUserDTO)
    }
}
