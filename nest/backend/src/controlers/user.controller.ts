import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import CreateUserDTO from 'src/dto/create-user.dto';
import FindUserDTO from 'src/dto/find-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    testNewUser() {
        let def: CreateUserDTO = {
            username: "toto",
            email: "toto@tata.fr",
            token: "lwknef",
        }
        this.userService.add(def);
        return this.userService.getUserByName("toto");
    }

    @Get("id")
    getUser(@Query() findUserDTO: FindUserDTO) {
        return this.userService.getUserById(findUserDTO);
    }

    @Post("new")
    newUser(@Body() createUserDTO: CreateUserDTO) {
        this.userService.add(createUserDTO);
    }

    @Patch("friend/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    addFriend(@Param('id1') id1:number, @Param('id2') id2:number) {
        this.userService.addFriend(id1, id2);
    }

    @Patch("unfriend/:id1/:id2")
    @HttpCode(HttpStatus.NO_CONTENT)
    removeFriend(@Param('id1') id1:number, @Param('id2') id2:number) {
        this.userService.removeFriend(id1, id2);
    }

    @Patch("block/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    blockUser(@Param('id1') id1:number, @Param('id2') id2:number) {
        this.userService.blockUser(id1, id2);
    }

    @Patch("unblock/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    unBlockUser(@Param('id1') id1:number, @Param('id2') id2:number) {
        this.userService.unBlockUser(id1, id2);
    }

    @Post("dm")
    @HttpCode(HttpStatus.CREATED)
    sendDM(@Body() sendDMDTO: SendDMDTO) {
        this.userService.sendDM(sendDMDTO)
    }

    @Delete("dm/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteDM(@Param('id') id: number) {
        this.userService.deleteDM(id);
    }
    
    @Delete(":id")
    deleteUser(@Param('id') id: number) {
        this.userService.delete(id);
    }
}
