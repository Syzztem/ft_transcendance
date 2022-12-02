import { Controller, UseGuards, Post, Req, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post("login")
  async login(@Req() req) {
	return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google-redirect')
  async signInWithGoogleRedirect(@Req() req) {
	return this.authService.googleLogin(req);
  }
}
