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

@WebSocketGateway({
cors: {
	origin: '*',
},
})
export class EventsGateway {
	@WebSocketServer()
	server: Server;
	pendingPlayer: Array<WsUser>;

	constructor(
		private gameService: GameService,
		private userService: UserService
	) {}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}

    @SubscribeMessage('hello')
    hello(): void {
		console.log("Hello from Nest")
	}

	@SubscribeMessage('joinMatchmaking')
	async joinMatchmaking(@ConnectedSocket() clientSocket: Socket) {
		const user = await this.userService.getUserById(1) // placeholder ==> Id from JWT
		const challenger = { socketId: clientSocket.id, user: user}

		if (this.pendingPlayer.length == 0){
			this.pendingPlayer.push(challenger)
			return ;
		}
		const owner = this.pendingPlayer.pop()
		this.initGame(owner, challenger)
	}

	async initGame(owner: WsUser, adverse: WsUser) {
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

	updateBoard(gameId: number, board: Board) {
		this.server.to(`game:${gameId}`).emit('updateBoard', board)
	}

	upadteScore(gameId: number, score: {owner: Score}) {
		this.server.to(`game:${gameId}`).emit('updateScore', score)
	}
}