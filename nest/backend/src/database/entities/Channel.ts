import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelMessage } from "./ChannelMessage";
import { User } from "./User";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @Column("string")
    name: string;

    @OneToOne(() => User)
    @JoinColumn()
    admin: User;

    @ManyToMany(() => User)
    @JoinColumn()
    users: User[]

    @OneToMany(() => ChannelMessage, (message) => message.channel)
    @JoinColumn()
    messages: ChannelMessage[]
}