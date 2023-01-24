import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Response } from '@nestjs/common';
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
    async getUser(@Query() findUserDTO: FindUserDTO,
                  @Response() res: any) {
        const user = await this.userService.getUserById(findUserDTO);
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        res.status(HttpStatus.OK).send();
        return user;
    }

    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO,
                  @Response() res: any) {
        const user = await this.userService.add(createUserDTO)
        if (!user) return res.status(HttpStatus.CONFLICT);
        res.status(HttpStatus.OK).send();
        return user;
    }

    @Patch("friend/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async addFriend(@Param('id1') id1:number,
                    @Param('id2') id2:number,
                    @Response() res: any) {
        res.status(await this.userService.addFriend(id1, id2)).send();
    }

    @Patch("unfriend/:id1/:id2")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeFriend(@Param('id1') id1:number, @Param('id2') id2:number,
                       @Response() res: any) {
        res.status(await this.userService.removeFriend(id1, id2)).send();
    }

    @Patch("block/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async blockUser(@Param('id1') id1:number, @Param('id2') id2:number,
                    @Response() res: any) {
        res.status(await this.userService.blockUser(id1, id2)).send();
    }

    @Patch("unblock/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async unBlockUser(@Param('id1') id1:number, @Param('id2') id2:number,
                      @Response() res: any) {
        res.status(await this.userService.unBlockUser(id1, id2)).send();
    }

    @Post("dm")
    @HttpCode(HttpStatus.CREATED)
    async sendDM(@Body() sendDMDTO: SendDMDTO,
                 @Response() res: any) {
        res.status(await this.userService.sendDM(sendDMDTO)).send();
    }

    @Delete("dm/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteDM(@Param('id') id: number,
                   @Response() res: any) {
        res.status(await this.userService.deleteDM(id)).send();
    }
    
    @Delete(":id")
    async deleteUser(@Param('id') id: number,
                     @Response() res: any) {
        res.status(await this.userService.delete(id)).send();
    }
}
