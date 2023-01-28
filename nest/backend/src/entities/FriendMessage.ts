import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { User } from "./User";

@Entity()
export class FriendMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    content: string;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    receiver: User;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;
}