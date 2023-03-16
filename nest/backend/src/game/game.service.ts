import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateGameDTO from './dto/create-game.dto';
import GetGameDTO from './dto/get-game.dto';
import { Game } from '../database/entities/Game';
import { Repository } from 'typeorm';
import Score from './interfaces/Score.interface';
// import IBall from './interfaces/IBalls';
// import IPaddle from './interfaces/IPaddle';
// import ITable from './interfaces/ITable';
// import IGameConfig from './interfaces/IGameConfig';
// import IScore from './interfaces/IScore';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
    ) {}

    async newGame(dto: CreateGameDTO) {
        let game: Game = this.gameRepository.create(dto);
        return await this.gameRepository.save(game);
    }

    async updateGame(gameId: number, score: Score) {
        this.gameRepository.update({id: gameId}, {
            player1Score: score.owner,
            player2Score: score.adverse
        })
    }

    async getGameById(dto: GetGameDTO) : Promise<Game> {
        return this.gameRepository.findOne({
            select: {
                player1Score: dto.scores,
                player2Score: dto.scores,
                timestamp: dto.timestamp
            },
            relations: {
                player1: dto.players,
                player2: dto.players
            },
            where: {id: dto.id}
        });
    }


    
}
