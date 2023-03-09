// import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
// import { Server ,Socket } from 'socket.io'
// import { GameService } from 'src/services/game.service'

// @WebSocketGateway({ path: 'game' })
// export class GameController implements OnGatewayConnection, OnGatewayDisconnect {
//     constructor(private readonly gameService: GameService) {}

//     @WebSocketServer() server: Server

//     handleConnection(client: Socket, ...args: any[]) {
//         this.gameService.addPlayer(client)
//     }

//     handleDisconnect(client: any) {
        
//     }

//     @SubscribeMessage('move')
//     handleMove(client: Socket ,payload: { playerIndex: number, direction: 'up' | 'down' }) {
//         this.gameService.movePaddle(payload.playerIndex, payload.direction)
//     }
// }