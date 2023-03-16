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
import { ConsoleLogger, UseGuards } from '@nestjs/common';
import Board from './interfaces/Board.interface';
import Score from './interfaces/Score.interface';
import WsUser from './interfaces/WsUser.interface';
import Key from './interfaces/Key.interface';
import { GameService } from './game.service';
import { UserService } from '../users/users.service';
import { User } from 'src/database/entities/User';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Game } from 'src/database/entities/Game';
import Match from './Match';

export enum Side {
	OWNER,
	ADVERSE
}

export enum KeyEvent {
	UP = 0,
	DOWN = 1
}
@WebSocketGateway(/*{
cors: {
	origin: '*',
},
}*/)

// @UseGuards(JwtAuthGuard)
export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	pendingPlayer: Array<WsUser> = [];
	matchsList = new Map<number, {
		game: Game
		match: Match
	}>();
	private logger = new Logger('GameGateway')
	
	constructor(
		private gameService: GameService,
		private userService: UserService,
		private jwtService: JwtService
		// pendingPlayer: Array<WsUser>
	) {}

	async handleConnection(@ConnectedSocket() clientSocket: Socket) {

		const payload = clientSocket.handshake.auth
		console.log("payload: ", payload);
		  const user = await this.userService.findOneById(this.jwtService.decode(clientSocket.handshake.auth.token).sub);  
		  if (!user)
		  	clientSocket.disconnect();
		else
			this.logger.log('New client connected in game gateway');	
	}

	handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
		this.logger.log('Client disconnected from game gateway');
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

	@SubscribeMessage('joinMatchmaking')
	async joinMatchmaking(@ConnectedSocket() clientSocket: Socket, @Request() req) {
		const clientId = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		const user = await this.userService.findOneById(clientId)
		const challenger = { socketId: clientSocket.id, user: user}
		this.logger.log('Player ' + challenger.user.username +  ' joined the queue');
		
		if (this.pendingPlayer.length == 0){
			this.pendingPlayer.push(challenger)
			// console.log("push user :", this.pendingPlayer)
			return ;
		}
		const owner = this.pendingPlayer.pop()
		// console.log("remove user :", this.pendingPlayer)
		this.initGame(owner, challenger)
	}

	@SubscribeMessage('keyUp')
	keyUp(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: Key){
		const clientId: number = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		let match: Match = this.matchsList[data.gameId].match
		let game: Game = this.matchsList[data.gameId].game
		let user: User = new User()

		user.id = clientId
		const side = this.getPlayerSide(user, game)
		match.updateKey(side, KeyEvent.UP, data.key)
	}

	@SubscribeMessage('keyDown')
	keyDown (@ConnectedSocket() clientSocket: Socket, @MessageBody() data: Key){
		const clientId: number = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		let match: Match = this.matchsList[data.gameId].match
		let game: Game = this.matchsList[data.gameId].game
		let user: User = new User()

		user.id = clientId
		const side = this.getPlayerSide(user, game)
		match.updateKey(side, KeyEvent.DOWN, data.key)
	}

	getPlayerSide(player: User, game: Game) { 
		return (player.id === game.player1.id ? Side.OWNER : Side.ADVERSE)
	}

	isPlayerAuthorize(player: User, game: Game) : boolean {
		return (player === game.player1 || player === game.player2)
	}

	async initGame(owner: WsUser, adverse: WsUser) {
		// console.log("initGame :", owner.socketId, adverse.socketId)
		const game = await this.gameService.newGame({
			player1: owner.user,
			player2: adverse.user,
			player1score: 0, // default value in entity ?
			player2score: 0  
		})
		this.logger.log(`Initialization of room ${game.id} with ${owner.user.username}(${owner.user.id}) against ${adverse.user.username}(${adverse.user.id})`); 
		const ownerSocket = this.server.sockets.sockets.get(owner.socketId);
		const adverdeSocket = this.server.sockets.sockets.get(adverse.socketId);
		ownerSocket.join(`game:${game.id}`)
		adverdeSocket.join(`game:${game.id}`)
		this.server.to(`game:${game.id}`).emit('redirectGame', game.id)
		this.startGame(game)
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

	startGame(game: Game) {
		let match: Match = new Match()
		const gameId = game.id

		this.matchsList[gameId] = {
			game: game,
			match: match
		}
		match.interval = setInterval((timestamp) => {
			this.updateBoard(
				gameId, {
					ownerPaddle: match.ownerPaddle,
					adversePaddle: match.adversePaddle,
					ball: match.ball,
					scores: {
						owner: match.ownerScore.score,
						adverse: match.adverseScore.score
					}
				}
			)
            // this.draw(1)
            match.gameConfig.lastFrameTimeMs = timestamp
            match.gameConfig.lastFpsUpdate = timestamp
            match.gameConfig.framesThisSecond = 0
			if (match.winner) {
				clearInterval(match.interval)
				this.gameService.updateGame(gameId, {
					owner: match.ownerScore.score,
					adverse: match.adverseScore.score
				})
				this.endGame(game, match)
			}
			match.loop(timestamp)
		}, 17)
		// match.gameConfig.frameId = requestAnimationFrame((timestamp) => {
		// 	this.updateBoard(
		// 		gameId, {
		// 			ownerPaddle: match.ownerPaddle,
		// 			adversePaddle: match.adversePaddle,
		// 			ball: match.ball
		// 		}
		// 	)
        //     // this.draw(1)
        //     match.gameConfig.lastFrameTimeMs = timestamp
        //     match.gameConfig.lastFpsUpdate = timestamp
        //     match.gameConfig.framesThisSecond = 0
        //     // this.beginLoop()
        //     match.gameConfig.frameId = requestAnimationFrame(match.loop.bind(match))
        // })

	}
	
	endGame(game: Game, match: Match) {
		this.server.to(`game:${game.id}`).emit('endGame', match.winner)
		this.server.to(`game:${game.id}`).socketsLeave(`game:${game.id}`)
	}
}