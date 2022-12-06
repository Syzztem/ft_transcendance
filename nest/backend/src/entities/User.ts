import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id :number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  rank: number;

  @Column()
  token: string;

  @Column()
  wins: number;
  
  @Column()
  losses: number;

  @Column()
  level: number;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[]

}