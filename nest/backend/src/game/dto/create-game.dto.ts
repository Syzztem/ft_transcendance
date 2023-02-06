import { User } from "../../database/entities/User";
import { Timestamp } from "typeorm";

export default class CreateGameDTO {
    player1: User;
    player2: User;
    player1score = 0;
    player2score = 0;
}