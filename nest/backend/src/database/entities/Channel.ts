import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanAndMute } from "./BanAndMute";
import { ChannelMessage } from "./ChannelMessage";
import { User } from "./User";
import * as bcrypt from 'bcrypt';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    name: string;

    @ManyToOne(() =>User)
    @JoinColumn()
    admin: User;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @OneToMany(() => ChannelMessage, message => message.channel)
    @JoinColumn()
    messages: ChannelMessage[]

    @Column({type: "boolean", default: false})
    isPrivate: boolean;

    @Column({type: "varchar", nullable: true, default: null})
    password?: string;

    @OneToMany(() => BanAndMute, ban => ban.channel)
    @JoinColumn()
    bannedOrMuted: BanAndMute[];


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 15);
    }

    async verifyPassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

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