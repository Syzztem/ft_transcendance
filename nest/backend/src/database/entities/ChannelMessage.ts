import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
export class ChannelMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    content: string;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel;

    @Column("timestamp")
    timestamp: Timestamp;
}