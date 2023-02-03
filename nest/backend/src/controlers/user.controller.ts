import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Response, UseGuards, Request } from '@nestjs/common';
import CreateUserDTO from 'src/dto/create-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import FindUserByNameDTO from 'src/dto/find-user-by-name.dto';
import { UserService } from 'src/services/user.service';
import FindUserByTokenDTO from 'src/dto/find-user-by-token.dto';
import UserBaseDTO from 'src/dto/change-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // @Get()
    // testNewUser() {
    //     let def: CreateUserDTO = {
    //         username: "toto",
    //         email: "toto@tata.fr",
    //         token: "lwknef",
    //     }
    //     this.userService.add(def);
    //     return this.userService.getUserByName("toto");
    // }

    // @Get("id")
    // async getUser(@Query() findUserDTO: FindUserDTO,
    //               @Response() res: any) {
    //     const user = await this.userService.getUserById(findUserDTO);
    //     if (!user) return res.status(HttpStatus.NOT_FOUND).send();
    //     return res.status(HttpStatus.OK).json({user});
    // }
    
    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO,
                  @Response() res: any) {
        const user = await this.userService.add(createUserDTO)
        if (!user) return res.status(HttpStatus.CONFLICT).send();
        return res.status(HttpStatus.OK).send();
    }

    @Post("login")
    async login(@Body() findUserByNameDTO: FindUserByNameDTO,
                    @Response() res: any) {
        const user = await this.userService.getUserByName(findUserByNameDTO)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json({
            id:     {user}.user.id,
            token:  {user}.user.token
        })
    }

    @Post("infos")
    async userInfos(@Body() findUserByTokenDTO: FindUserByTokenDTO,
                    @Response() res: any) {
        const user = await this.userService.getUserByToken(findUserByTokenDTO)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send()
        return res.status(HttpStatus.OK).json({
            id:         {user}.user.id,
            profilePic: {user}.user.profilePic,
            username:   {user}.user.username
        })
    }

    @Patch("username")
    async changeUsername(@Body() userBaseDTO: UserBaseDTO,
                            @Response() res: any) {
        res.status(await this.userService.changeUsername(userBaseDTO)).send()
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

    // @Delete("dm/:id")
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async deleteDM(@Param('id') id: number,
    //                @Response() res: any) {
    //     res.status(await this.userService.deleteDM(id)).send();
    // }
    
    // @Delete(":id")
    // async deleteUser(@Param('id') id: number,
    //                  @Response() res: any) {
    //     res.status(await this.userService.delete(id)).send();
    // }
}
