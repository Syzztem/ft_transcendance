import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
	ConnectedSocket
  } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import Board from './interfaces/Board.interface';
import Score from './interfaces/Score.interface';
import WsUser from './interfaces/WsUser.interface';
import { GameService } from './game.service';
import { UserService } from '../users/users.service';
import { User } from 'src/database/entities/User';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(/*{
cors: {
	origin: '*',
},
}*/)

export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	pendingPlayer: Array<WsUser> = [];
	private logger = new Logger('GameGateway')
	
	constructor(
		private gameService: GameService,
		private userService: UserService,
		// pendingPlayer: Array<WsUser>
	) {}

	handleConnection(@ConnectedSocket() clientSocket: Socket) {
		this.logger.log('New client connected');	
	}

	handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
		this.logger.log('Client disconnected');
		this.leaveMatchmaking(clientSocket);
	}

	// afterInit(server: Server) {
		
	// }
	
	@UseGuards(JwtAuthGuard)
	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}

    // @SubscribeMessage('hello')
    // hello(): void {
	// 	console.log("Hello from Nest")
	// }

	@SubscribeMessage('joinMatchmaking')
	async joinMatchmaking(@ConnectedSocket() clientSocket: Socket) {
		console.log("join mactchmaking :", clientSocket.id)
		const user = await this.userService.findOneById(1) // placeholder ==> Id from JWT
		const challenger = { socketId: clientSocket.id, user: user}

		if (this.pendingPlayer.length == 0){
			this.pendingPlayer.push(challenger)
			console.log("push user :", this.pendingPlayer)
			return ;
		}
		const owner = this.pendingPlayer.pop()
		console.log("remove user :", this.pendingPlayer)
		this.initGame(owner, challenger)
	}

	async initGame(owner: WsUser, adverse: WsUser) {
		console.log("initGame :", owner.socketId, adverse.socketId)
		const game = await this.gameService.newGame({
			player1: owner.user,
			player2: adverse.user,
			player1score: 0, // default value in entity ?
			player2score: 0  
		})
		const ownerSocket = this.server.sockets.sockets.get(owner.socketId);
		const adverdeSocket = this.server.sockets.sockets.get(adverse.socketId);
		ownerSocket.join(`game:${game.id}`)
		adverdeSocket.join(`game:${game.id}`)
		this.server.to(`game:${game.id}`).emit('redirectGame', game.id)
	}

	@SubscribeMessage('leaveMatchmaking')
	leaveMatchmaking(@ConnectedSocket() clientSocket: Socket) {
		this.pendingPlayer.forEach((player: WsUser) => {
			if (player.socketId == clientSocket.id) {
				this.pendingPlayer.splice(this.pendingPlayer.indexOf(player))
			}
		})
	}

	updateBoard(gameId: number, board: Board) {
		this.server.to(`game:${gameId}`).emit('updateBoard', board)
	}

	upadteScore(gameId: number, score: {owner: Score}) {
		this.server.to(`game:${gameId}`).emit('updateScore', score)
	}

	
}