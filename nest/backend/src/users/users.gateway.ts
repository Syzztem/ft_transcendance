import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
	ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import WsUser from 'src/game/interfaces/WsUser.interface';
import { UserService } from './users.service';
import { JwtService } from '@nestjs/jwt';  

@WebSocketGateway()
export class UsersGateway implements OnGatewayDisconnect, OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	UserConnected: Array<WsUser> = [];
	private logger = new Logger('UserGateway')
	
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	/********************************************************************** *
	 * 						Connection
	 * 
	 * *********************************************************************/

	async handleConnection(@ConnectedSocket() clientSocket: Socket) {

		const payload = clientSocket.handshake.auth
		  const user = await this.userService.findOneById(this.jwtService.decode(clientSocket.handshake.auth.token).sub);  
		  if (!user)
		  	clientSocket.disconnect();
		else
		{
			this.logger.log(`${user.username} is online`);
			this.UserConnected.push({socketId: clientSocket.id, user: user})
		}	
	}

	handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
		this.UserConnected.forEach((user: WsUser) => {
			if (user.socketId == clientSocket.id) {
				this.UserConnected.splice(this.UserConnected.indexOf(user))
				this.logger.log(`${user.user.username} is now offline`);
			}
		})
	}
	




	
}