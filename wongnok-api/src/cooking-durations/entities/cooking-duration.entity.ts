import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cooking_durations')
export class CookingDuration {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
