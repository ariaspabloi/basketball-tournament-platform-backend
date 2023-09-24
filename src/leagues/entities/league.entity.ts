import { Match } from 'src/matches/entities/match.entity';
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
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  rules?: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @ManyToOne(() => User, (organizer) => organizer.leagues, { cascade: false })
  organizer: User;

  @ManyToOne(() => User, (organizer) => organizer.wins, { cascade: false })
  winner?: User;

  @OneToMany(
    () => TeamLeagueStatistic,
    (teamLeagueStatistic) => teamLeagueStatistic.league,
    { cascade: false },
  )
  teamLeagueStatistics?: TeamLeagueStatistic;

  @OneToMany(() => Match, (match) => match.league, { cascade: false })
  matches?: Match;
}
