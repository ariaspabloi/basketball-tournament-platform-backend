import { League } from 'src/leagues/entities/league.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TeamLeagueStatistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {
    default: 0,
  })
  points: number;

  @Column('int', {
    default: 0,
  })
  pointsAgainst: number;

  @Column('int', {
    default: 0,
  })
  favorablePoints: number;

  @Column('int', {
    default: 0,
  })
  matchesLost: number;

  @Column('int', {
    default: 0,
  })
  matchesWon: number;

  @ManyToOne(() => Team, (team) => team.teamLeagueStatistics, {
    cascade: false,
  })
  team: Team;

  @ManyToOne(() => League, (league) => league.teamLeagueStatistics, {
    cascade: false,
  })
  league: League;
}
