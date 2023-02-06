import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Channel } from './Channel';
import { Game } from './Game';

@Entity()
@Unique(["username", "email", "token"])
export class User {
  @PrimaryGeneratedColumn()
  id :number;

  @Column("varchar", {length: 8})
  username: string;

  @Column("varchar", {length: 254})
  email: string;

  @Column("int")
  rank: number = 0;

  @Column("varchar")
  token: string;

  @Column("int")
  wins: number = 0;
  
  @Column("int")
  losses: number = 0;

  @Column("int")
  level: number = 0;

  @Column({nullable: true, type:'varchar'})
  profilePic: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blocked: User[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[]

  @OneToMany(() => Game, (game) => game.player1)
  games: Game[]

  @OneToMany(() => Game, (game) =>game.player2)
  games2: Game[]
}