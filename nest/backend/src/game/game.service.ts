import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateGameDTO from './dto/create-game.dto';
import GetGameDTO from './dto/get-game.dto';
import { Game } from '../database/entities/Game';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

    async newGame(dto: CreateGameDTO) {
        this.gameRepository.create(dto);
    }

    async getGameById(dto: GetGameDTO) : Promise<Game> {
        return this.gameRepository.findOne({
            select: {
                player1Score: dto.scores,
                player2Score: dto.scores,
//                timestamp: dto.timestamp      //ne fonctionne pas + ca m'a saoule
            },
            relations: {
                player1: dto.players,
                player2: dto.players
            },
            where: {id: dto.id}
        });
    }
}
