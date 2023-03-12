import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../database/entities/Game';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), UsersModule],
    controllers: [GameController],
    providers: [ GameGateway, GameService, Logger],
    exports: [Logger]
})
export class GameModule { }
