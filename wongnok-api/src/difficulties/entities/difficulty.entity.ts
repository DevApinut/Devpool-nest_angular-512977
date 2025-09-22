import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('difficulties')
export class Difficulty {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}
