import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
	  private usersService: UsersService,
	  private jwtService: JwtService
	) {}
  
	async validateUser(username: string, pass: string): Promise<any> {
	  const user = await this.usersService.findOne(username);
	  if (user && user.password === pass) {
		const { password, ...result } = user;
		return result;
	  }
	  return null;
	}
  
	async login(user: any) {
	  const payload = { username: user.username, sub: user.userId };
	  return {
		access_token: this.jwtService.sign(payload),
	  };
	}
	googleLogin(req) {
		console.log("bonjour")
		if (!req.user) {
		  return 'No user from google'
		}
	
		return {
		  message: 'User information from google',
		  user: req.user
		}
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