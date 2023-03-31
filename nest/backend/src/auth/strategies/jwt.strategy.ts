import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.bGetById(payload.sub)
    if (!user)
      return
    if (user.isTwoFactorAuthenticationEnabled) {
      if (user.TwoFactorAuthenticated && user.lastSuccessfulAuth) {
        const now = new Date()
        const lastSuccessfulAuth = new Date(user.lastSuccessfulAuth)
        const timeDiff = Math.abs(now.getTime() - lastSuccessfulAuth.getTime())
        const diffMinutes = Math.ceil(timeDiff / (1000 * 60))
        if (diffMinutes > 10) {
          user.TwoFactorAuthenticated = false
          await this.userService.update2fa(user.id, false)
        }
      }
    }
    return { sub: payload.sub, username: payload.login42 };
  }
}
 
