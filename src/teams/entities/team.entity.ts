import { Division } from 'src/divisions/entities/division.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { TeamLeagueStatistic } from 'src/team-league-statistics/entities/team-league-statistic.entity';
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

  @ManyToOne(() => User, (user) => user.teams, { eager: true, cascade: false })
  club: User;

  @ManyToOne(() => Division, (user) => user.teams, {
    eager: true,
    cascade: false,
  })
  division: Division;

  @OneToMany(() => Player, (player) => player.team, {
    eager: true,
    cascade: false,
  })
  players?: Player[];

  @OneToMany(
    () => TeamLeagueStatistic,
    (teamLeagueStatistic) => teamLeagueStatistic.team,
    { cascade: false },
  )
  teamLeagueStatistics?: TeamLeagueStatistic;

  @OneToMany(() => Match, (match) => match.away, { cascade: false })
  awayMatches?: Match[];

  @OneToMany(() => Match, (match) => match.home, { cascade: false })
  homeMatches?: Match[];
}
