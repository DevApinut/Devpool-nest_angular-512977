import { Test, TestingModule } from '@nestjs/testing';
import { FoodRecipesService } from './food-recipes.service';

describe('FoodRecipesService', () => {
  let service: FoodRecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodRecipesService],
    }).compile();

    service = module.get<FoodRecipesService>(FoodRecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
