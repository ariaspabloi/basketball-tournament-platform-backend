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

  @Column('text') // Campo name con valor predeterminado de cadena vacía
  name: string;

  @Column('text') // Campo rut con valor predeterminado de cadena vacía
  rut: string;

  @Column('date')
  birthdate: string;

  @Column('text', {
    nullable: true,
  })
  image?: string;

  @ManyToOne(() => Team, (team) => team.players, {
    cascade: false,
  })
  team: Team;

  @Column('text', { default: '' }) // Campo phone con valor predeterminado de cadena vacía
  phone?: string;

  @Column('text', { default: '' }) // Campo email con valor predeterminado de cadena vacía
  email?: string;

  @Column('text', { default: '' }) // Campo emergencyName con valor predeterminado de cadena vacía
  emergencyName?: string;

  @Column('text', { default: '' }) // Campo emergencyPhone con valor predeterminado de cadena vacía
  emergencyPhone?: string;

  @Column('int', { default: 0 })
  height?: number;

  @Column('int', { default: 0 })
  weight?: number;

  @Column('text', { default: '' }) // Campo position con valor predeterminado de cadena vacía
  position?: string;

  @Column('int', { default: 0 })
  shirtNumber?: number;

  @Column('text', { default: '' }) // Campo shirtSize con valor predeterminado de cadena vacía
  shirtSize?: string;

  @Column('text', { default: '' }) // Campo shortsSize con valor predeterminado de cadena vacía
  shortsSize?: string;

  @Column('text', { default: '' }) // Campo shoeSize con valor predeterminado de cadena vacía
  shoeSize?: string;

  @Column('text', { default: '' }) // Campo clinicalDetail con valor predeterminado de cadena vacía
  clinicalDetail?: string;

  @OneToMany(
    () => PlayerStatistic,
    (playerStatictics) => playerStatictics.player,
    { cascade: false },
  )
  playersStatistics?: PlayerStatistic[];
}
