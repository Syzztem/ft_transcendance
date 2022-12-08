import { Controller, UseGuards, Post, Request , Get, Query, Body, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ftAuthGuard } from "./guards/ft.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @UseGuards(ftAuthGuard)
  @Get()
  async getFtAuthCode(){
  }
  
  @UseGuards(ftAuthGuard)
  @Get('42/callback')
  async ftlogin() {
  }
  
  // @UseGuards(AuthGuard('google'))
  // @Get('google')
  // async signInWithGoogle() {}
  
  // @UseGuards(AuthGuard('google'))
  // @Get('google-redirect')
  // async signInWithGoogleRedirect(@Req() req) {
    // return this.authService.googleLogin(req);
    // }

    // @UseGuards(ftAuthGuard)
    // @Post('login')
    // async login(@Request() req) {
    //   return req.user;
    // }
  }
