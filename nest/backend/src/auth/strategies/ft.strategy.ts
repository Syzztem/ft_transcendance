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
      callbackURL: "http://127.0.0.1:3000/auth/42/callback",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    let user = await this.userService.getUserByName({ username: profile.username })
    if (!user) {
      const newUser : CreateUserDTO = {
        username: profile.username, // WARNING Boolean needed
        login42: profile.username,
        email: "", // besoin reel ?
        token: accessToken
      }
      user = await this.userService.add(newUser);
    }
    return user;
  }
}
