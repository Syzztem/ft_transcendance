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

@WebSocketGateway()
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
	) {}

	/********************************************************************** *
	 * 						Connection
	 * 
	 * *********************************************************************/

	async handleConnection(@ConnectedSocket() clientSocket: Socket) {

		const payload = clientSocket.handshake.auth
		  const user = await this.userService.userExists(this.jwtService.decode(clientSocket.handshake.auth.token).sub);  
		  if (!user)
		  	clientSocket.disconnect();
		else
			this.logger.log('New client connected in game gateway');	
	}

	handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
		this.logger.log('Client disconnected from game gateway');
		this.leaveMatchmaking(clientSocket);
	}
	
	/********************************************************************** *
	 * 						Matchmaking
	 * 
	 * *********************************************************************/

	@SubscribeMessage('joinMatchmaking')
	async joinMatchmaking(@ConnectedSocket() clientSocket: Socket, @Request() req) {
		const clientId = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		const user = await this.userService.findOneById(clientId)
		const challenger = { socketId: clientSocket.id, user: user}
		this.logger.log('Player ' + challenger.user.username +  ' joined the queue');
		
		if (this.pendingPlayer.length == 0){
			this.pendingPlayer.push(challenger)
			return ;
		}
		const owner = this.pendingPlayer.pop()
		this.initGame(owner, challenger)
	}
	
	@SubscribeMessage('leaveMatchmaking')
	leaveMatchmaking(@ConnectedSocket() clientSocket: Socket) {
		const playload = this.jwtService.decode(clientSocket.handshake.auth.token) as {id: number, username: string}
		this.logger.log(`${playload.username} left the queue`)
		this.pendingPlayer.forEach((player: WsUser) => {
			if (player.socketId == clientSocket.id) {
				this.pendingPlayer.splice(this.pendingPlayer.indexOf(player))
			}
		}) 
	}


	/********************************************************************** *
	 * 						Match
	 * 
	 * *********************************************************************/

	@SubscribeMessage('keyUp')
	keyUp(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: Key){
		this.handleKey(clientSocket, data, KeyEvent.UP)
	}

	@SubscribeMessage('keyDown')
	keyDown (@ConnectedSocket() clientSocket: Socket, @MessageBody() data: Key){
		this.handleKey(clientSocket, data, KeyEvent.DOWN)
	}

	handleKey(clientSocket: Socket, data: Key, event: KeyEvent) {
		const clientId: number = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		let game: Game = this.matchsList.get(data.gameId).game
		let match: Match = this.matchsList.get(data.gameId).match
		let user: User = new User()
		user.id = clientId

		if (!this.isUserPlayer(user, game))
			return
		const side = this.getPlayerSide(user, game)
		match.updateKey(side, event, data.key)
	}

	getPlayerSide(player: User, game: Game) { 
		return (player.id === game.player1.id ? Side.OWNER : Side.ADVERSE)
	}
	
	isUserPlayer(player: User, game: Game) : boolean {
		return (player.id === game.player1.id || player.id === game.player2.id)
	}
 
	async initGame(owner: WsUser, adverse: WsUser) {
		const game = await this.gameService.newGame({
			player1: owner.user,
			player2: adverse.user,
			player1score: 0,
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
	
		updateBoard(gameId: number, board: Board) {
			this.server.to(`game:${gameId}`).emit('updateBoard', board)
		}
	
		startGame(game: Game) {
			let match: Match = new Match()
			const gameId = game.id
	
			this.matchsList.set(
				gameId,
				{
					game: game,
					match: match
				}
			)
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
				match.gameConfig.lastFrameTimeMs = timestamp
				match.gameConfig.lastFpsUpdate = timestamp
				match.gameConfig.framesThisSecond = 0
				if (match.winner) {
					this.endGame(game, match)
				}
				match.loop(timestamp)
			}, 17)	
		}


	/********************************************************************** *
	 * 						Rooms
	 * 
	 * *********************************************************************/

	@SubscribeMessage('joinGame')
	joinGame(@ConnectedSocket() clientSocket: Socket, @MessageBody() gameId: number) {
		clientSocket.join(`game:${gameId}`)
	}

	@SubscribeMessage('leaveGame')
	leaveGame(@ConnectedSocket() clientSocket: Socket, @MessageBody() gameId: number) {
		const clientId: number = this.jwtService.decode(clientSocket.handshake.auth.token).sub
		if (!this.matchsList.has(gameId))
			return ;
		let match: Match = this.matchsList.get(gameId).match
		let game: Game = this.matchsList.get(gameId).game
		let user: User = new User()
		
		user.id = clientId
		clientSocket.leave(`game:${gameId}`)
		if (!this.isUserPlayer(user, game))
			return;
		const side = this.getPlayerSide(user, game)
		match.winner = side === Side.OWNER ? 'LEFT' : 'RIGHT'
		match.ownerScore.score = side === Side.OWNER ? 0 : 11
		match.adverseScore.score = side === Side.OWNER ? 11 : 0
		this.endGame(game, match)
	}
	
	endGame(game: Game, match: Match) {
		clearInterval(match.interval)
		this.gameService.updateGame(game.id, {
			owner: match.ownerScore.score,
			adverse: match.adverseScore.score
		})
		this.userService.incrementWins(match.winner  === 'LEFT' ? game.player2.id : game.player1.id)
		this.userService.incrementLosses(match.winner === 'RIGHT' ? game.player2.id : game.player1.id)
		this.server.to(`game:${game.id}`).emit('endGame', match.winner)
		this.server.to(`game:${game.id}`).socketsLeave(`game:${game.id}`)
	}
}