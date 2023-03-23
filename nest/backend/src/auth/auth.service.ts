import { Injectable, BadRequestException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from 'src/database/entities/User';
import * as speakeasy from 'speakeasy'
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UserService,
	  private jwtService: JwtService
	) {}
  
	private secrets: Map<number, string> = new Map()

	async validateUser(token: string): Promise<any> {
		return this.jwtService.verify(token, {secret: jwtConstants.secret})
	}

	// async generateTwoFactorAuthenticationSecret(id: number) {
	// 	const secret = speakeasy.generateSecret()
	// 	console.log('secret generate: ', secret.base32)
	// 	await this.usersService.setTwoFactorAuthenticationSecret(secret.base32, id);
	// 	return secret.otpauth_url
	// }

	// async generateQrCodeDataURL(otpAuthUrl: string) {
	// 	return toDataURL(otpAuthUrl);
	// }

	// async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, id: number) {
	// 	const user = await this.usersService.getUserById(id)
	// 	console.log('secret validation: ', user.twoFactorAuthenticationSecret)
	// 	const isValid = speakeasy.totp.verify({
    //     	token: twoFactorAuthenticationCode,
    //     	secret: user.twoFactorAuthenticationSecret,
	// 		encoding: 'base32'
    //   	});
	// 	return isValid
    // }

	// async loginWith2fa(userWithoutPsw: Partial<User>) {
	// 	const payload = {
	// 		email: userWithoutPsw.email,
	// 		isTwoFactorAuthenticationEnabled: !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
	// 		isTwoFactorAuthenticated: true,
	// 	};
	// 	return {
	// 		email: payload.email,
	// 		access_token: this.jwtService.sign(payload)
	// 	};
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
		  isTwoFactorAuthenticationEnabled: !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
		  isTwoFactorAuthenticated: true,
		};
	
		return {
		  email: payload.email,
		  access_token: this.jwtService.sign(payload),
		};
	  }
  
	async login(user: any) {
		const payload = { username: user.login42, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
