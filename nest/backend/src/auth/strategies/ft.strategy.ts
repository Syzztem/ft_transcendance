import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Profile, Strategy } from 'passport-42';
import { UserService } from 'src/users/users.service';
import CreateUserDTO from 'src/users/dto/create-user.dto';

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private authService: AuthService, private userService: UserService) {
    super({
      clientID: process.env.FT_ID,
      clientSecret: process.env.FT_SECRET,
      callbackURL: "http://" + process.env.URL + ":3000/auth/42/callback",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    let user = await this.userService.findByLogin(profile.username)
    if (!user) {
      const newUser : CreateUserDTO = {
        username: '', // WARNING Boolean needed
        login42: profile.username,
        email: "", // besoin reel ?
        token: accessToken,
        twofaActivated: false,
      }
      user = await this.userService.add(newUser);
    }
    return user;
  }
}
