// rating.entity.ts
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { FoodRecipe } from './food-recipe.entity';


@Entity('ratings')
@Unique(['user', 'foodRecipe']) // user can rate a recipe only once
export class Rating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  score: number;

  @ManyToOne(() => FoodRecipe, { nullable: false })
  @JoinColumn({ name: 'food_recipe_id', referencedColumnName: 'id' })
  foodRecipe: FoodRecipe;


  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;
}