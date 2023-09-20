import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Team, (team) => team.players, { cascade: false })
  team: Team;
}
