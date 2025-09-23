import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { FoodRecipe } from './entities/food-recipe.entity';
import { CreateFoodRecipeDto } from './dto/create-food-recipe.dto';
import { UpdateFoodRecipeDto } from './dto/update-food-recipe.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

const paginateConfig: PaginateConfig<FoodRecipe> = {
  sortableColumns: ['id', 'name', 'avgRating', 'ratingCount'],
  searchableColumns: ['name', 'ingredient'],
};

@Injectable()
export class FoodRecipesService {
  constructor(
    @InjectRepository(FoodRecipe)
    private readonly repository: Repository<FoodRecipe>,
  ) {}

  private queryTemplate() {
    return this.repository
      .createQueryBuilder('food_recipe')
      .leftJoinAndSelect('food_recipe.difficulty', 'difficulty')
      .leftJoinAndSelect('food_recipe.cookingDuration', 'cookingDuration')
      .leftJoin('food_recipe.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username')
      .addSelect('user.role');
  }

  async onModuleInit() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save([
        {
          name: 'Beef Wellington',
          description:
            'อยากทำเมนูอาหารต่างประเทศหรู ๆ กินเองที่บ้าน แต่ไม่รู้ว่าจะต้องซื้อ หรือทำอะไรบ้าง กล่องนี้ ทำง่าย ครบ จบในกล่องเดียว',
          ingredient: 'Spaghetti, eggs, pancetta, cheese',
          instruction:
            'Cook pasta. Mix eggs and cheese. Combine with pancetta.',
          imageUrl: 'https://foodish-api.com/images/burger/burger11.jpg',
          cooking_duration_id: 2,
          username: 'u104',
          difficulty_id: 2,
        },
        {
          name: 'ปลาทอดราดซอสเขียวหวาน ด้วยคนอร์สูตรสำเร็จ',
          description: 'Spicy Thai soup with shrimp.',
          ingredient: 'Shrimp, lemongrass, chili, lime',
          instruction: 'Boil broth. Add ingredients. Simmer and serve.',
          imageUrl: 'https://foodish-api.com/images/rice/rice9.jpg',
          cooking_duration_id: 2,
          username: 'u105',
          difficulty_id: 3,
        },
        {
          name: 'Pancakes',
          description: 'Fluffy breakfast pancakes.',
          ingredient: 'Flour, eggs, milk, baking powder',
          instruction: 'Mix ingredients. Fry in pan.',
          imageUrl: 'https://foodish-api.com/images/dessert/dessert13.jpg',
          cooking_duration_id: 1,
          username: 'u103',
          difficulty_id: 1,
        },
        {
          name: 'Beef Stew',
          description: 'Hearty slow-cooked beef stew.',
          ingredient: 'Beef, potatoes, carrots, onions',
          instruction: 'Brown beef. Add vegetables and simmer.',
          imageUrl: 'https://foodish-api.com/images/burger/burger5.jpg',
          cooking_duration_id: 4,
          username: 'u104',
          difficulty_id: 2,
        },
        {
          name: 'Caesar Salad',
          description: 'Crisp romaine with Caesar dressing.',
          ingredient: 'Romaine, croutons, parmesan, dressing',
          instruction: 'Mix ingredients and toss.',
          imageUrl: 'https://foodish-api.com/images/pizza/pizza12.jpg',
          cooking_duration_id: 1,
          username: 'u105',
          difficulty_id: 1,
        },
        {
          name: 'Green Curry',
          description: 'Thai green curry with chicken.',
          ingredient: 'Chicken, curry paste, coconut milk',
          instruction: 'Fry paste, add meat and coconut milk.',
          imageUrl: 'https://foodish-api.com/images/pasta/pasta4.jpg',
          cooking_duration_id: 3,
          username: 'u104',
          difficulty_id: 2,
        },
        {
          name: 'Grilled Cheese Sandwich',
          description: 'Simple grilled cheese sandwich.',
          ingredient: 'Bread, cheese, butter',
          instruction: 'Butter bread, grill with cheese.',
          imageUrl: 'https://foodish-api.com/images/samosa/samosa8.jpg',
          cooking_duration_id: 1,
          username: 'u105',
          difficulty_id: 1,
        },
        {
          name: 'Sushi Rolls',
          description: 'Japanese sushi rolls.',
          ingredient: 'Rice, seaweed, fish, vegetables',
          instruction: 'Roll ingredients in seaweed.',
          imageUrl: 'https://foodish-api.com/images/biryani/biryani15.jpg',
          cooking_duration_id: 3,
          username: 'u104',
          difficulty_id: 3,
        },
        {
          name: 'Pad Thai',
          description: 'Stir-fried Thai noodles.',
          ingredient: 'Noodles, tofu, peanuts, sauce',
          instruction: 'Fry noodles with ingredients.',
          imageUrl: 'https://foodish-api.com/images/pasta/pasta6.jpg',
          cooking_duration_id: 2,
          username: 'u105',
          difficulty_id: 2,
        },
        {
          name: 'Fruit Smoothie',
          description: 'Refreshing blended fruit drink.',
          ingredient: 'Banana, berries, yogurt',
          instruction: 'Blend all ingredients.',
          imageUrl: 'https://foodish-api.com/images/dessert/dessert20.jpg',
          cooking_duration_id: 1,
          username: 'u104',
          difficulty_id: 1,
        },
      ]);
    }
  }

  async search(query: PaginateQuery) {
    const page = await paginate<FoodRecipe>(
      query,
      this.queryTemplate(),
      paginateConfig,
    );

    return {
      data: page.data,
      meta: page.meta,
    };
  }

  create(createFoodRecipeDto: CreateFoodRecipeDto, loggedInDto: LoggedInDto) {
    return this.repository.save({
      ...createFoodRecipeDto,
      user: { username: loggedInDto.username },
    });
  }

  findAll() {
    return `This action returns all foodRecipes`;
  }

  findOne(id: number) {
    return this.queryTemplate().where('food_recipe.id = :id', { id }).getOne();
  }

  async update(
    id: number,
    updateFoodRecipeDto: UpdateFoodRecipeDto,
    loggedInDto: LoggedInDto,
  ) {
    return this.repository
      .findOneByOrFail({ id, user: { username: loggedInDto.username } })
      .then(() => this.repository.save({ id, ...updateFoodRecipeDto }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }

  remove(id: number, loggedInDto: LoggedInDto) {
    return this.repository
      .findOneByOrFail({ id, user: { username: loggedInDto.username } })
      .then(() => this.repository.delete({ id }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }
}
