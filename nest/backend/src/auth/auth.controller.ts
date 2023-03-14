import { Controller, UseGuards, Post, Request , Get, Body, Redirect, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ftAuthGuard } from "./guards/ft.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserService } from "src/users/users.service";
import { UnauthorizedException, HttpCode } from "@nestjs/common";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('42/callback')
  @UseGuards(ftAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const access_token = await this.authService.login(req.user)
    await this.userService.updateToken(req.user.id, access_token);
    //res.json({token: access_token}) avec ca la requete est envoyee au back
    const url = new URL('http://' + process.env.URL)
    url.port = '8080'
    url.pathname = 'login'
    url.searchParams.set('token', access_token)
    url.searchParams.set('id', req.user.id)
    // console.log("url= ", url.href)
    res.redirect(url.href)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    const isCodeValid =
      this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"}) //not in cookies anymore
    res.send("logged out")
  }
}
