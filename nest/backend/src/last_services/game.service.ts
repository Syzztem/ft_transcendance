import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io'

@Injectable()
export class GameService {
    private players: Socket[] = []
    
    public addPlayer(player: Socket) {
        this.players.push(player)
        if (this.players.length === 2)
            this.startGame()
    }

    private startGame() {

    }

    public movePaddle(playerIndex: number, direction: 'up' | 'down') {

    }

    public ballUpdate() {
        
    }
}
