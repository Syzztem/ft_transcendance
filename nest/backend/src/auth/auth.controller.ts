import { Controller, UseGuards, Post, Request , Get, Query, Body, Redirect, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ftAuthGuard } from "./guards/ft.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import cookieParser from 'cookie-parser';
import { UserService } from "src/users/users.service";


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('42/callback')
  @UseGuards(ftAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const access_token = await this.authService.login(req.user)
    await this.userService.updateToken(req.user.id, access_token);
    res.json({token: access_token})
    // const url = new URL('http://' + process.env.URL)
    // url.port = '8080'
    // url.pathname = 'userInfos'
    // url.searchParams.set('token', access_token)
    // res.redirect(url.href)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"})
    res.send("logged out")
  }
}
