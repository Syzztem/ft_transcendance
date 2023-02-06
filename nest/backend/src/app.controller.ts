import { Controller, Request, Post, UseGuards, Get, Redirect, Query } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ftAuthGuard } from './auth/guards/ft.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
  
  @Get()
  @UseGuards(ftAuthGuard)
  @Redirect('https://api.intra.42.fr/oauth/authorize', 302)



  // @Get('')
  // @UseGuards(ftAuthGuard)
  // async ftauth(@Request() req) {}

  @UseGuards(ftAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return req.user;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
}
