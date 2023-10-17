import { League } from 'src/leagues/entities/league.entity';
import { PlayerStatistic } from 'src/player-statistics/entities/player-statistic.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  dateTime: Date;

  @Column('text')
  place: string;

  @Column('boolean', { default: false })
  friendlyMatch: boolean;

  @Column('int', { default: 0 })
  homePoints: number;

  @Column('int', { default: 0 })
  awayPoints: number;

  @ManyToOne(() => Team, (team) => team.homeMatches, { cascade: false })
  home: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches, { cascade: false })
  away: Team;

  @ManyToOne(() => League, (league) => league.matches, { cascade: false })
  league?: League;

  @ManyToOne(() => User, (organizer) => organizer.matches, { cascade: false })
  organizer: User;

  @OneToMany(
    () => PlayerStatistic,
    (playerStatictics) => playerStatictics.match,
    { cascade: false },
  )
  playersStatistics?: PlayerStatistic[];
}
