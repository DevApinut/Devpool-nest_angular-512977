import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RatingDto } from './dto/rating.dto';
import { FoodRecipe } from './entities/food-recipe.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(private datasource: DataSource) {}

  async rate(
    foodRecipeId: number,
    ratingDto: RatingDto,
    loggedInDto: LoggedInDto,
  ) {
    // create transaction
    return this.datasource.transaction(async (entityManager) => {
      const ratingRepository = entityManager.getRepository(Rating);
      const foodRecipeRepository = entityManager.getRepository(FoodRecipe);

      // upsert rating
      const keys = {
        foodRecipe: { id: foodRecipeId },
        user: { username: loggedInDto.username },
      };
      await ratingRepository
        .upsert(
          { score: ratingDto.score, ...keys },
          { conflictPaths: ['foodRecipe', 'user'] },
        )
        .catch(() => {
          throw new NotFoundException(`Not found: id=${foodRecipeId}`);
        });

      // query last avg & count
      const { avg, count } = await ratingRepository
        .createQueryBuilder('rating')
        .select('AVG(rating.score)', 'avg')
        .addSelect('COUNT(rating.id)', 'count')
        .where('rating.food_recipe_id = :foodRecipeId', { foodRecipeId })
        .getRawOne();

      // update FoodRecipe
      await foodRecipeRepository.update(foodRecipeId, {
        avgRating: parseFloat(avg),
        ratingCount: parseInt(count, 10),
      });

      return foodRecipeRepository.findOneBy({ id: foodRecipeId });
    });
  }
}
