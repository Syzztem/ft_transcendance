import { Controller, UseGuards, Post, Request , Get, Query, Body, Redirect, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ftAuthGuard } from "./guards/ft.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @UseGuards(ftAuthGuard)
  @Get()
  async ftlogin(){
  }
  
  @Get('42/callback')
  @UseGuards(ftAuthGuard)
  async redirect(@Request() req, @Res() res) {
    const access_token = this.authService.login(req.user)
    res.cookie('jwt', access_token, {sameSite: "Lax"})
    res.redirect('http://localhost:8080')
  }

  @UseGuards(ftAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(ftAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }


  @UseGuards(ftAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req, @Res() res) {
    res.clearCookie('jwt', {sameSite: "Lax"})
    res.send("logged out")
  }
}
