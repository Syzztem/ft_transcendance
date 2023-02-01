import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateGameDTO from 'src/dto/create-game.dto';
import GetGameDTO from 'src/dto/get-game.dto';
import { Game } from 'src/entities/Game';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

    async newGame(dto: CreateGameDTO) {
        let game: Game = this.gameRepository.create(dto);
        return this.gameRepository.save(game);
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
