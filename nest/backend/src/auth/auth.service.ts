import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from 'src/database/entities/User';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UserService,
	  private jwtService: JwtService
	) {}
  
	async validateUser(token: string): Promise<any> {
	return this.jwtService.verify(token, {secret: jwtConstants.secret})
	}
  
	// async login(user: any) {
	// 	console.log('Sign JWT')
	//   const payload = { username: user.username, sub: user.userId };
	//   return { 
	// 	access_token: this.jwtService.sign(payload),
	//   };
	// }

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.email, 'AUTH_APP_NAME', secret);
	
		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
	
		return {
		  secret,
		  otpauthUrl
		}
	  }

	  async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	  }	

	  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: user.twoFactorAuthenticationSecret,
        });
      }

	  async loginWith2fa(userWithoutPsw: Partial<User>) {
		const payload = {
		  email: userWithoutPsw.email,
		  isTwoFactorAuthenticationEnabled: !!userWithoutPsw.twofaActivated,
		  isTwoFactorAuthenticated: true,
		};
	
		return {
		  email: payload.email,
		  access_token: this.jwtService.sign(payload),
		};
	  }
  
	async login(user: any) {
		console.log('login user', user)
		const payload = { username: user.login42, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
