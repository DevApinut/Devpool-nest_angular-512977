// food-recipe.entity.ts
import { CookingDuration } from '@app/cooking-durations/entities/cooking-duration.entity';
import { Difficulty } from '@app/difficulties/entities/difficulty.entity';
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'food_recipes' })
export class FoodRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  ingredient: string;

  @Column()
  instruction: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Difficulty)
  @JoinColumn({ name: 'difficulty_id', referencedColumnName: 'id' })
  difficulty: Difficulty;

  @ManyToOne(() => CookingDuration)
  @JoinColumn({ name: 'cooking_duration_id', referencedColumnName: 'id' })
  cookingDuration: CookingDuration;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ type: 'float', default: 0 })
  avgRating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;
}
