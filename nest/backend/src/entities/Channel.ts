import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanAndMute } from "./BanAndMute";
import { ChannelMessage } from "./ChannelMessage";
import { User } from "./User";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    name: string;

    @OneToOne(() => User)
    @JoinColumn()
    admin: User;

    @ManyToMany(() => User)
    @JoinColumn()
    users: User[]

    @OneToMany(() => ChannelMessage, message => message.channel)
    @JoinColumn()
    messages: ChannelMessage[]

    @Column("boolean")
    isPrivate: boolean;

    @Column("varchar")
    password: string;

    @OneToMany(() => BanAndMute, ban => ban.channel)
    @JoinColumn()
    bannedOrMuted: BanAndMute[];

    public isBanned(userId: number) : boolean {
        if (this.bannedOrMuted.find(ban => ban.user.id === userId && ban.isBanned))
            return true;
        return false;
    }

    public isMuted(userId: number) : boolean {
        if (this.bannedOrMuted.find(ban => ban.user.id === userId && !ban.isBanned))
            return true;
        return false;
    }

    public isOn(userId: number) : boolean {
        if (this.users.find(user => user.id === userId))
            return true;
        return false;
    }

    public removeUser(userId: number) : boolean {
        if (!this.isOn(userId)) return false;
        this.users.filter(user => user.id !== userId)
        return true;
    }
}