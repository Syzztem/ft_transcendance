import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { User } from "./User";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.games)
    player1: User;

    @ManyToOne(() => User, (user) => user.games2)
    player2: User;

    @Column("int")
    player1Score: number;

    @Column("int")
    player2Score: number;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;
}