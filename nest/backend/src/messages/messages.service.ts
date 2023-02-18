import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages : Message[] = [{ name : 'Marius', text: 'heyooo' }];
  clientToUser = {};

  identify(name: string, clientId: string)
  {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser); // could be used to check who is currently online
  }

  getClientName(clientId : string)
  {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto) {
    const message = {...CreateMessageDto};
    this.messages.push(createMessageDto); // TODO : improve to add join
    return message;
  }

  findAll() {
    return this.messages; // return results from DB instead
  }
}
