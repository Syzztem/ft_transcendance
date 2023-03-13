import CreateUserDTO from './dto/create-user.dto';
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import SendDMDTO from 'src/dto/send-dm.dto';
import { User } from '../database/entities/User';
import { UserService } from './users.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
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
    @UseGuards(JwtAuthGuard)
    @Get("id/:id")
    async getUser(@Param('id') id: number,
                  @Response() res: any) : Promise<User> {
        const user = await this.userService.getUserById(id);
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json({username: {user}.user.username, profilePic: {user}.user.profilePic});
    }
    @UseGuards(JwtAuthGuard)
    @Get("profilepic/:username")
    async getProfilePic(@Param('username') username : string,
                        @Response() res : any) {
        const path = UserService.PP_PATH + username + '.jpg';
        if (!fs.existsSync(path)) return res.status(HttpStatus.OK).sendFile('/usr/app/profilepics/defaultpp.jpg');
        res.status(HttpStatus.OK).sendFile(path);
    }
    @UseGuards(JwtAuthGuard)
    @Post("/setpp/:username")
    @UseInterceptors(FileInterceptor('file'))
    async setProflePic(@Param('username') username: string,
                        @UploadedFile() file: Express.Multer.File,
                        @Response() res : any) {
        const path = UserService.PP_PATH + username + '.jpg';
        fs.writeFile(path, file.buffer, (err) => {
            if (err) res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            else res.status(HttpStatus.OK).send();
        })
    }
    @UseGuards(JwtAuthGuard)
    @Post("verify/:id")
    async verifyToken(@Body() token: string,
                      @Param('id') id: number,
                      @Response() res: any) {
        res.status(await this.userService.verifyToken(id, token)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO,
                  @Response() res: any) {
        const user = await this.userService.add(createUserDTO);
        if (!user) return res.status(HttpStatus.CONFLICT).send();
        res.status(HttpStatus.OK).send();
        return user;
    }

    @Post("login")
    async login(@Body() username: string,
                    @Response() res: any) {
        const user = await this.userService.getUserByName(username)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json({user})
    }

    @Patch("username/:id")
    @HttpCode(HttpStatus.OK)
    async changeUsername(   @Body() username: string,
                            @Param('id') id: number,
                            @Response() res: any) {
        res.status(await this.userService.changeUsername({id, username})).send()
    }

    // @Patch("username")
    // @HttpCode(HttpStatus.OK)
    // async changeUsername( @Req() req,  @Body() changeUserDTO: ChangeUserDTO, @Response() res: any) {
    //     console.log("ID ?: ", req)
    //     const user = await this.userService.getUserById(req.user.id)
    //     if (!user) return res.status(HttpStatus.NOT_FOUND).send()
    //     const oldPath = '/usr/app/profilepics/' + user.username + '.jpg'
    //     const newPath = '/usr/app/profilepics/' + changeUserDTO.username + '.jpg'
    //     fs.rename(oldPath, newPath, (err) => {
    //         if (err) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
    //     })
    //     res.status(await this.userService.changeUsername(changeUserDTO)).json({username: changeUserDTO.username})
    // }

    @UseGuards(JwtAuthGuard)
    @Patch("friend/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async addFriend(@Param('id1') id1:number,
                    @Param('id2') id2:number,
                    @Response() res: any) {
        res.status(await this.userService.addFriend(id1, id2)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("unfriend/:id1/:id2")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeFriend(@Param('id1') id1:number, @Param('id2') id2:number,
                       @Response() res: any) {
        res.status(await this.userService.removeFriend(id1, id2)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("block/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async blockUser(@Param('id1') id1:number, @Param('id2') id2:number,
                    @Response() res: any) {
        res.status(await this.userService.blockUser(id1, id2)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("unblock/:id1/:id2")
    @HttpCode(HttpStatus.CREATED)
    async unBlockUser(@Param('id1') id1:number, @Param('id2') id2:number,
                      @Response() res: any) {
        res.status(await this.userService.unBlockUser(id1, id2)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Post("dm")
    @HttpCode(HttpStatus.CREATED)
    async sendDM(@Body() sendDMDTO: SendDMDTO,
                 @Response() res: any) {
        res.status(await this.userService.sendDM(sendDMDTO)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Delete("dm/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteDM(@Param('id') id: number,
                   @Response() res: any) {
        res.status(await this.userService.deleteDM(id)).send();
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteUser(@Param('id') id: number,
                     @Response() res: any) {
        res.status(await this.userService.delete(id)).send();
    }
}
