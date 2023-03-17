import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
  } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

  @WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })
  export class EventsGateway {
	@WebSocketServer()
	server: Server;
  
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
	// printWebsocket() {
	// 	console.log("Hello websocket !")
	// }
  }