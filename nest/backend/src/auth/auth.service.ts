import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UsersService,
	  private jwtService: JwtService
	) {}
  
	async validateUser(): Promise<any> {
	//   const user = await this.usersService.findOne(username);
	//   if (user && user.password === pass) {
		// const { password, ...result } = user;
		// return result;
	//   }
	  return null;
	}
  
	async login(user: any) {
	  const payload = { username: user.username, sub: user.userId };
	  return {
		access_token: this.jwtService.sign(payload),
	  };
	}
}

/******************************
 * 
 * 
 * Need to store th passwd 
 * Using a library
 * Ex bcrypt:
 * 
 * 
 *	import * as bcrypt from 'bcrypt';
 *	
 *	const saltOrRounds = 10;
 *	const password = 'random_password';
 *	const hash = await bcrypt.hash(password, saltOrRounds);
 *  ===> Create the hashed passwd
 * 
 * const isMatch = await bcrypt.compare(password, hash);
 * ====> Compare if passwd match
 *
 * 
 *****************************/