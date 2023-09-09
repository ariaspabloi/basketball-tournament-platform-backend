import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;
}
