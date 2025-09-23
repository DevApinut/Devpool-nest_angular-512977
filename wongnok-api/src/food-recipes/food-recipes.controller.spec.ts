import { Test, TestingModule } from '@nestjs/testing';
import { FoodRecipesController } from './food-recipes.controller';
import { FoodRecipesService } from './food-recipes.service';

describe('FoodRecipesController', () => {
  let controller: FoodRecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodRecipesController],
      providers: [FoodRecipesService],
    }).compile();

    controller = module.get<FoodRecipesController>(FoodRecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
