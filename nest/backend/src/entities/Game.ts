import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { User } from "./User";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    player1: User;

    @ManyToOne(() => User)
    player2: User;

    @Column()
    player1Score: number;

    @Column()
    player2Score: number;

    @Column()
    timestamp: Timestamp;
}