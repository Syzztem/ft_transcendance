import CreateUserDTO from './dto/create-user.dto';
import FindUserDTO from './dto/find-user.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import FindUserByTokenDTO from 'src/dto/Find-user-by-token.dto'
import SendDMDTO from 'src/dto/send-dm.dto';
import { User } from '../database/entities/User';
import FindUserByNameDTO from 'src/dto/find-user-by-name.dto';
import { UserService } from './users.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import ChangeUserDTO from 'src/dto/change-user.dto';

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

    @Get("/id/:id")
    async getUser(@Param('id') id: number,
                  @Response() res: any) {
        let findUserDTO = new FindUserDTO()
        findUserDTO.id = id
        const user = await this.userService.getUserById(findUserDTO);
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json({username: {user}.user.username});
    }

    @Get("/profilepic/:username")
    async getProfilePic(@Param('username') username : string,
                        @Response() res : any) {
        const path = '/usr/app/profilepics/' + username + '.jpg';
        if (!fs.existsSync(path)) return res.status(HttpStatus.OK).sendFile('/usr/app/profilepics/defaultpp.jpg');
        res.status(HttpStatus.OK).sendFile(path);
    }

    @Post("setpp")
    @UseInterceptors(FileInterceptor('file'))
    async setProfilePic(@Body() findUserByTokenDTO: FindUserByTokenDTO,
                        @UploadedFile() file: Express.Multer.File,
                        @Response() res: any) {
        const user = await this.userService.getUserByToken(findUserByTokenDTO)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send()
        const path = '/usr/app/profilepics/' + user.username + '.jpg'
        fs.writeFile(path, file.buffer, (err) => {
            if (err) res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
            else res.status(HttpStatus.OK).send()
        })
    }

    // @Post("/setpp/:username")
    // @UseInterceptors(FileInterceptor('file'))
    // async setProflePic(@Param('username') username: string,
    //                     @UploadedFile() file: Express.Multer.File,
    //                     @Response() res : any) {
    //     const path = '/usr/app/profilepics/' + username + '.jpg';
    //     fs.writeFile(path, file.buffer, (err) => {
    //         if (err) res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    //         else res.status(HttpStatus.OK).send();
    //     })
    // }

    @Post("verify/:id")
    async verifyToken(@Body() token: string,
                      @Param('id') id: number,
                      @Response() res: any) {
        res.status(await this.userService.verifyToken(id, token)).send();
    }

    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO,
                  @Response() res: any) {
        const user = await this.userService.add(createUserDTO);
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

    @Patch("username")
    @HttpCode(HttpStatus.OK)
    async changeUsername(@Body() changeUserDTO: ChangeUserDTO,
                            @Response() res: any) {
        const user = await this.userService.getUserByToken({token: changeUserDTO.token})
        if (!user) return res.status(HttpStatus.NOT_FOUND).send()
        const oldPath = '/usr/app/profilepics/' + user.username + '.jpg'
        const newPath = '/usr/app/profilepics/' + changeUserDTO.username + '.jpg'
        fs.rename(oldPath, newPath, (err) => {
            if (err) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
        })
        res.status(await this.userService.changeUsername(changeUserDTO)).send()
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
