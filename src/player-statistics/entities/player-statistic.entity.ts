import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlayerStatistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  fouls: number;

  @Column('int', { default: 0 })
  freeThrows: number;

  @Column('int', { default: 0 })
  doubleDoubles: number;

  @Column('int', { default: 0 })
  threePointers: number;

  @Column('int', { default: 0 })
  turnovers: number;

  @Column('int', { default: 0 })
  offensiveRebounds: number;

  @Column('int', { default: 0 })
  defensiveRebounds: number;

  @Column('int', { default: 0 })
  assists: number;

  @Column('int', { default: 0 })
  losses: number;

  @ManyToOne(() => Player, (player) => player.playersStatistics, {
    cascade: false,
  })
  player: Player;

  @ManyToOne(() => Match, (match) => match.playersStatistics, {
    cascade: false,
  })
  match: Match;
}
