// food-recipes.module.ts
import { Module } from '@nestjs/common';
import { FoodRecipesService } from './food-recipes.service';
import { FoodRecipesController } from './food-recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodRecipe } from './entities/food-recipe.entity';
import { RatingService } from './rating.service';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodRecipe, Rating])],
  controllers: [FoodRecipesController],
  providers: [FoodRecipesService, RatingService],
})
export class FoodRecipesModule {}
