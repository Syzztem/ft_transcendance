import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UserService,
	  private jwtService: JwtService
	) {}
  
	async validateUser(token: string): Promise<any> {
	return this.jwtService.verify(token, {secret: jwtConstants.secret})

	}
  
	async login(user: any) {
		console.log('Sign JWT')
	  const payload = { username: user.username, sub: user.userId };
	  return { 
		access_token: this.jwtService.sign(payload),
	  };
	}
}
