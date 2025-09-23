// create-food-recipe.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createFoodRecipeSchema = z
  .object({
    name: z.string().min(1, 'name is required'),
    description: z.string().min(1, 'description is required'),
    ingredient: z.string().min(1, 'ingredient is required'),
    instruction: z.string().min(1, 'instruction is required'),
    imageUrl: z.url('image must be a valid URL').optional(),
    difficulty: z.object({
      id: z
        .number()
        .int()
        .min(1, 'difficulty.id must be a number between 1 - 3')
        .max(3, 'difficulty.id must be a number between 1 - 3'),
    }),
    cookingDuration: z.object({
      id: z
        .number()
        .int()
        .min(1, 'cookingDuration.id must be a number between 1 - 5')
        .max(5, 'cookingDuration.id must be a number between 1 - 5'),
    }),
  })
  .strict();

export class CreateFoodRecipeDto extends createZodDto(createFoodRecipeSchema) {}
