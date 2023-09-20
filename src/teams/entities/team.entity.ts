import { Division } from 'src/divisions/entities/division.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  coach: string;

  @ManyToOne(() => User, (user) => user.teams, { cascade: false })
  club: User;

  @ManyToOne(() => Division, (user) => user.teams, { cascade: false })
  division: Division;

  @OneToMany(() => Player, (player) => player.team, { cascade: false })
  players?: Player;
}
