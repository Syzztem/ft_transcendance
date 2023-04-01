import { AfterLoad, BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    mods: User[];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @OneToMany(() => ChannelMessage, message => message.channel, {onDelete: 'CASCADE'})
    @JoinColumn()
    messages: ChannelMessage[]

    @Column({type: "boolean", default: false})
    isPrivate: boolean;

    @Column({type: "varchar", nullable: true, default: null})
    password?: string;

    @OneToMany(() => BanAndMute, ban => ban.channel, {onDelete: 'CASCADE'})
    @JoinColumn()
    bannedOrMuted: BanAndMute[];

    @AfterLoad()
    async removepassword() {
        this.password = undefined;
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 15);
    }

    public isMod(id: number) : boolean {
        return (this.mods.find(mod => mod.id == id) != null)
    }

    async verifyPassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

    public isBanned(userId: number) : boolean {
        return (this.bannedOrMuted.find(ban => ban.user.id === userId && ban.isBanned) != null)
    }

    public isMuted(userId: number) : boolean {
        return (this.bannedOrMuted.find(ban => ban.user.id === userId && !ban.isBanned) != null)
    }

    public isOn(userId: number) : boolean {
        return (this.users.find(user => user.id == userId) != null)
    }

    public removeUser(userId: number) : boolean {
        if (!this.isOn(userId)) return false;
        this.users = this.users.filter(user => user.id !== userId);
        this.mods = this.mods.filter(user => user.id !== userId);
        return true;
    }

    public updateBans() {
        const bmcpy = this.bannedOrMuted.filter(ban => (ban.expires <= new Date()))
        if (bmcpy.length == this.bannedOrMuted.length)
            return false;
        this.bannedOrMuted = bmcpy;
        return true;
    }
}