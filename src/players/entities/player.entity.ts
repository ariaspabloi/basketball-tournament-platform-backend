import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
