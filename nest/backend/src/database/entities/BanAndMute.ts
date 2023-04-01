import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
export class BanAndMute {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Channel, channel => channel.bannedOrMuted)
    channel: Channel;

    @Column('boolean')
    isBanned: boolean;       //true if banned, false if muted

    @Column("timestamp")
    expires: Date;
}