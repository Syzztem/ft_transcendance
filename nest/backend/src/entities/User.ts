import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './Game';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id :number;

  @Column("varchar", {length: 8})
  username: string;

  @Column("varchar", {length: 254})
  email: string;

  @Column("int")
  rank: number;

  @Column("varchar")
  token: string;

  @Column("int")
  wins: number;
  
  @Column("int")
  losses: number;

  @Column("int")
  level: number;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[]

  @OneToMany(() => Game, (game) => game.player1)
  games: Game[]

  @OneToMany(() => Game, (game) =>game.player2)
  games2: Game[]
}