import { PlayerStatistic } from 'src/player-statistics/entities/player-statistic.entity';
import { Team } from 'src/teams/entities/team.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  rut: string;

  @Column('date')
  birthdate: string;

  @ManyToOne(() => Team, (team) => team.players, {
    cascade: false,
  })
  team: Team;

  @OneToMany(
    () => PlayerStatistic,
    (playerStatictics) => playerStatictics.player,
    { cascade: false },
  )
  playersStatistics?: PlayerStatistic;
}
