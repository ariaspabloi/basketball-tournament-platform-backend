import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Team } from 'src/teams/entities/team.entity';
import { League } from 'src/leagues/entities/league.entity';
import { Match } from 'src/matches/entities/match.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.users, { eager: true, cascade: false })
  role: Role;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @OneToMany(() => Team, (team) => team.club, { cascade: false })
  teams?: Team[];

  @OneToMany(() => League, (league) => league.organizer, { cascade: false })
  leagues?: League[];

  @OneToMany(() => League, (league) => league.winner, { cascade: false })
  wins?: League[];

  @OneToMany(() => Match, (match) => match.organizer, { cascade: false })
  matches?: Match[];
}
