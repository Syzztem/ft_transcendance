import { Controller, UseGuards, Post, Request , Get, Query, Body, Redirect, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ftAuthGuard } from "./guards/ft.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import cookieParser from 'cookie-parser';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42/callback')
  @UseGuards(ftAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const access_token = await this.authService.login(req.user.user)
    const url = new URL('http://' + process.env.URL)
    url.port = '8080'
    url.pathname = 'userInfos'
    res.cookie('token', req.user.token)
    res.cookie('id', req.user.user.id)
    res.status(302).redirect(url.href)
  }

  @UseGuards(ftAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(ftAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"})
    res.send("logged out")
  }
}
