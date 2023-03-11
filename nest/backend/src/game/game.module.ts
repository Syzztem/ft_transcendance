import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../database/entities/Game';
import { GameGateway } from './game.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Game])],
    controllers: [GameController],
    providers: [GameService, GameGateway]
})
export class GameModule { }
