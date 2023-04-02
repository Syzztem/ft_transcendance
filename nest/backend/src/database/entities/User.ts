import { AfterLoad, BeforeInsert, BeforeRemove, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Channel } from './Channel';
import { Game } from './Game';
import * as bcrypt from 'bcrypt'

@Entity()
@Unique(["username", "email", "token"])
export class User {
  @PrimaryGeneratedColumn()
  id :number;

  @Column("varchar", {length: 8})
  username: string;

  @Column("varchar", {length: 8})
  login42: string;

  @Column("varchar", {length: 254})
  email: string;

  @Column("int")
  rank: number = 0;

  @Column("varchar")
  token?: string;

  @Column("int")
  wins: number = 0;
  
  @Column("int")
  losses: number = 0;

  @Column("int")
  level: number = 0;

  @Column({nullable: true, type:'varchar'})
  profilePic: string;

  @Column({nullable: true, type:'varchar'})
  twoFactorAuthenticationSecret: string;

  @Column({type:'boolean', default: false})
  TwoFactorAuthenticated: boolean;

  @Column({type:'boolean', default: false})
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({type: 'timestamp', nullable: true})
  lastSuccessfulAuth: Date;

  @ManyToMany(() => User, user => user.friendOf, {cascade: true, onUpdate: 'CASCADE'})
  @JoinTable({name: "friends"})
  friends: User[];

  @ManyToMany(() => User, user => user.friends, {onUpdate: 'CASCADE'})
  friendOf: User[]

  @ManyToMany(() => User, user => user.blockedBy, {cascade: true, onUpdate: 'CASCADE'})
  @JoinTable({name: "blocked"})
  blocked: User[];

  @ManyToMany(() => User, user => user.blocked, {onUpdate: 'CASCADE'})
  blockedBy: User[];

  @ManyToMany(() => Channel, (chan) => chan.users, {onUpdate: 'CASCADE'})
  channels: Channel[];

  @ManyToMany(() => Channel, (chan) => chan.mods, {onUpdate: 'CASCADE'})
  modOn: Channel[];

  @OneToMany(() => Game, (game) => game.player1, {cascade: true})
  games: Game[];

  @OneToMany(() => Game, (game) => game.player2, {cascade: true})
  games2: Game[];

  @AfterLoad()
  removeToken() {
    this.token = undefined;
  }

  @BeforeInsert()
  async hashToken() {
      this.token = await bcrypt.hash(this.token, 15);
      if (!this.isTwoFactorAuthenticationEnabled)
          this.twoFactorAuthenticationSecret = null;
  }

  async verifyToken(token: string) {
      return bcrypt.compare(token, this.token);
  }

  public isFriend(user: User) {
    return (this.friends.find(u => u.id == user.id) != null)
  }

  public isBlocked(user: User) {
    return (this.blocked.find(u => u.id == user.id) != null)
  }

  @BeforeRemove()
  public logRemoval() {
    console.log("deleted " + this.username);
  }
}