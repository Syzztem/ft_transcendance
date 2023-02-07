import { User } from "src/entities/User";

export default class CreateGameDTO {
    player1: User;
    player2: User;
    player1score = 0;
    player2score = 0;
}