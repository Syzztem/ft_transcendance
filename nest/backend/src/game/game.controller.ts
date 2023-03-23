import { Controller, Get, UseGuards } from '@nestjs/common';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
}
