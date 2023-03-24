import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../database/entities/Game';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), UsersModule, AuthModule],
    controllers: [GameController],
    providers: [ GameGateway, GameService, Logger, JwtService],
    exports: [Logger]
})
export class GameModule { }
