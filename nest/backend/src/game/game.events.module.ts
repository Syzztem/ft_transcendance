import { Module } from '@nestjs/common';
import { EventsGateway } from './game.events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}