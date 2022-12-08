import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Profile, Strategy } from 'passport-42';

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FT_ID,
      clientSecret: process.env.FT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/42/callback",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const user = {

     
    }
    console.log('this is a token: ', accessToken)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
    // return cb(null, user);
  }
}

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
//     const user = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       accessToken,
//       refreshToken,
//     };
    // done(null, user);
  // }
// }