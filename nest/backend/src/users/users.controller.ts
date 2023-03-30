import CreateUserDTO from './dto/create-user.dto';
import SendDMDTO from 'src/dto/send-dm.dto';
import { User } from '../database/entities/User';
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Response, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { UserService } from './users.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import FindUserDTO from './dto/find-user.dto';

@Controller('user')
export class UsersController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("id")
    async getUser(@Body() dto: FindUserDTO,
                  @Response() res: any) : Promise<User> {
        const user = await this.userService.getUserById(dto);
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).send(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/me")
    async getMe(@Req() req: any, @Response() res: any) : Promise<User> {
        const user = await this.userService.getUserById(req.user.sub);
        if (!user)
            return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).send(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/stats")
    async getStats(@Req() req: any, @Response() res: any) {
        const user = await this.userService.getUserById(req.user.sub)
        if (!user)
            return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).send({ rank: user.rank, wins: user.wins, losses: user.losses, level: user.level, id: user.id, username: user.username, games: user.games })
    }

    @UseGuards(JwtAuthGuard)
    @Get("profilepic/:username")
    async getProfilePic(@Param('username') username : string,
                        @Response() res : any) {
        const path = 'http://' + process.env.URL + ':3000/profilepics/' + username + '.jpg';
        if (!fs.existsSync(UserService.PP_PATH + username + '.jpg'))
            return res.status(HttpStatus.OK).send('http://' + process.env.URL + ':3000/profilepics/defaultpp.jpg');
        res.status(HttpStatus.OK).send(path);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/setpp/:username")
    @UseInterceptors(FileInterceptor('file'))
    async setProflePic(@Param('username') username: string,
                        @UploadedFile() file: Express.Multer.File,
                        @Response() res : any) {
        if (!file)
            return res.status(HttpStatus.FAILED_DEPENDENCY).send()
        const path = 'http://' + process.env.URL + ':3000/profilepics/' + username + '.jpg';
        fs.writeFile(UserService.PP_PATH + username + '.jpg', file.buffer, (err) => {
            if (err)
                res.status(HttpStatus.NOT_FOUND).send();
            else
                res.status(HttpStatus.OK).send(path);
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post("verify/:id")
    async verifyToken(@Body() token: string,
                      @Param('id') id: number,
                      @Response() res: any) {
        res.status(await this.userService.verifyToken(id, token)).send(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("new")
    async newUser(@Body() createUserDTO: CreateUserDTO,
                  @Response() res: any) {
        const user = await this.userService.add(createUserDTO);
        if (!user) return res.status(HttpStatus.CONFLICT).send();
        res.status(HttpStatus.OK).send(user);
    }

    @Post("login")
    async login(@Body() username: string,
                    @Response() res: any) {
        const user = await this.userService.getUserByName(username)
        if (!user) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).send(user)
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch("username")
    @HttpCode(HttpStatus.OK)
    async changeUsername(   @Body() data: {username: string}, // {user: wour}
                            @Req() req,
                            @Response() res: any) {
        res.status(await this.userService.changeUsername({id: req.user.sub, username: data.username, token: req.user.token})).send()
    }

    @UseGuards(JwtAuthGuard)
    @Patch("friend")
    @HttpCode(HttpStatus.CREATED)
    async addFriend(@Req() req: any, @Body() data: any, @Response() res: any) {
        return res.status(await this.userService.addFriend(req.user.sub, data.id)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("unfriend")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeFriend(@Req() req: any, @Body() data: any, @Response() res: any) {
        res.status(await this.userService.removeFriend(req.user.sub, data.id)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("block")
    @HttpCode(HttpStatus.CREATED)
    async blockUser(@Req() req: any, @Body() data: any, @Response() res: any) {
        res.status(await this.userService.blockUser(req.user.sub, data.id)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Patch("unblock")
    @HttpCode(HttpStatus.CREATED)
    async unBlockUser(@Req() req: any, @Body() data: any, @Response() res: any) {
        res.status(await this.userService.unBlockUser(req.user.sub, data.id)).send();
    }

    @UseGuards(JwtAuthGuard)
    @Post("dm")
    @HttpCode(HttpStatus.CREATED)
    async sendDM(@Body() sendDMDTO: SendDMDTO,
                 @Response() res: any) {
        res.status(await this.userService.sendDM(sendDMDTO)).send(sendDMDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("dm/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteDM(@Param('id') id: number,
                   @Response() res: any) {
        res.status(await this.userService.deleteDM(id)).send(id);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteUser(@Param('id') id: number,
                     @Response() res: any) {
        res.status(await this.userService.delete(id)).send();
    }
}
