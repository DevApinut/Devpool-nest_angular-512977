// food-recipes.controller.ts
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateFoodRecipeDto } from './dto/create-food-recipe.dto';
import { UpdateFoodRecipeDto } from './dto/update-food-recipe.dto';
import { FoodRecipesService } from './food-recipes.service';
import { RatingDto } from './dto/rating.dto';
import { RatingService } from './rating.service';

@Controller('food-recipes')
export class FoodRecipesController {
  constructor(
    private readonly foodRecipesService: FoodRecipesService,
    private ratingService: RatingService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createFoodRecipeDto: CreateFoodRecipeDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.foodRecipesService.create(createFoodRecipeDto, req.user);
  }

  @Get()
  search(@Paginate() query: PaginateQuery) {
    return this.foodRecipesService.search(query);
  }

  @Get(':id')
  findOne(@Param() idDto: IdDto) {
    return this.foodRecipesService.findOne(idDto.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param() idDto: IdDto,
    @Body() updateFoodRecipeDto: UpdateFoodRecipeDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.foodRecipesService.update(
      idDto.id,
      updateFoodRecipeDto,
      req.user,
    );
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param() idDto: IdDto, @Req() req: { user: LoggedInDto }) {
    this.foodRecipesService.remove(idDto.id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/rating')
  rating(
    @Param() idDto: IdDto,
    @Body() ratingDto: RatingDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.ratingService.rate(idDto.id, ratingDto, req.user);
  }
}
