import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from 'src/database/entities/User';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UserService,
	  private jwtService: JwtService
	) {}
  
	async validateUser(token: string): Promise<any> {
		console.log('validateUser')
		return this.jwtService.verify(token, {secret: jwtConstants.secret})
	}
  
	async login(user: any) {
		console.log('login user', user)
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
