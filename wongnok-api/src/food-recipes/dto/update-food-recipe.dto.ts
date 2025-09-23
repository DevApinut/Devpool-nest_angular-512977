// update-food-recipe.dto.ts
import { createZodDto } from 'nestjs-zod';
import { createFoodRecipeSchema } from './create-food-recipe.dto';

const updateFoodRecipeDtoSchema = createFoodRecipeSchema.partial();

export class UpdateFoodRecipeDto extends createZodDto(
  updateFoodRecipeDtoSchema,
) {}
