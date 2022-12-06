import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class FriendMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    receiver: User;
}