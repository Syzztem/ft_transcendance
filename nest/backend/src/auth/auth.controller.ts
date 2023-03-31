import { Controller, UseGuards, Post, Request , Get, Query, Body, Redirect, Res, Req, HttpCode, UnauthorizedException, Response, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ftAuthGuard } from "./guards/ft.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserService } from "src/users/users.service";
import { User } from 'src/database/entities/User';
import * as speakeasy from 'speakeasy'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('42/callback')
  @UseGuards(ftAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const access_token = await this.authService.login(req.user)
    await this.userService.updateToken(req.user.id, access_token);
    const url = new URL('http://' + process.env.URL)
    url.port = '8080'
    url.pathname = 'login'
    url.searchParams.set('token', access_token)
    url.searchParams.set('id', req.user.id)
    res.redirect(url.href)
  }

  @UseGuards(JwtAuthGuard)
  @Post('islogin')
  async isLogin(@Req() req, @Response() res, @Body() body) {
    return res.status(HttpStatus.OK).send()
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('2fa/turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.code,
        request.user.sub,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuthentication(request.user.sub);
  }

  @Post('2fa/turn-off')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Req() req: any) {
    await this.userService.turnOffTwoFactorAuthentication(req.user.sub);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(
      body.code,
      request.user.sub,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    this.userService.update2fa(request.user.sub, true)
    return this.authService.loginWith2fa(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/actived')
  async ifActived(@Req() req,  @Response() res: any) {
    const tfaSecret = await this.userService.get2FAsecret(req.user.sub)
    return res.status(HttpStatus.OK).send(tfaSecret != null)
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Response() response, @Request() request) {
    const url = await this.authService.generateTwoFactorAuthenticationSecret(request.user);
    response.send(url.otpauthUrl)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res) {
    const tfasecret = await this.userService.get2FAsecret(req.user.sub)
    if (tfasecret)
      await this.userService.update2fa(req.user.sub, false)
    res.send("logged out")
  }
}
