import CreateUserDTO from './dto/create-user.dto';
import FindUserDTO from './dto/find-user.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import SendDMDTO from 'src/dto/send-dm.dto';
import { User } from '../database/entities/User';
import FindUserByNameDTO from 'src/dto/find-user-by-name.dto';
import { UserService } from './users.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

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

    @Get("id")
    async getUser(@Query() findUserDTO: FindUserDTO,
                  @Response() res: any) : Promise<User> {
        const user = await this.userService.getUserById(findUserDTO);
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        res.status(HttpStatus.OK).send();
        return user;
    }

    @Get("/profilepic/:username")
    async getProfilePic(@Param('username') username : string,
                        @Response() res : any) {
        const path = '/profilepics/' + username + '.jpg';
        if (!fs.existsSync(path)) return res.status(HttpStatus.OK).sendFile('/defaultpp.jpg');
        res.status(HttpStatus.OK).sendFile(path);
    }

    @Post("/setpp/:username")
    @UseInterceptors(FileInterceptor('file'))
    async setProfilePic(@Param('username') username: string,
                        @UploadedFile() file: Express.Multer.File,
                        @Response() res : any) {
        const path = '/profilepics/' + username + '.jpg';
        fs.writeFile(path, file.buffer, (err) => {
            if (err) res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            else res.status(HttpStatus.OK).send();
        })
    }

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
        res.status(HttpStatus.OK).send();
        return user;
    }

    @Post("login")
    async login(@Body() findUserByNameDTO: FindUserByNameDTO,
                    @Response() res: any) {
        const user = await this.userService.getUserByName(findUserByNameDTO)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json({user})
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