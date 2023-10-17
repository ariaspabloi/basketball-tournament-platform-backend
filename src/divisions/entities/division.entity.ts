import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  category: string;

  @OneToMany(() => Team, (team) => team.division, { cascade: true })
  teams?: Team[];
}
