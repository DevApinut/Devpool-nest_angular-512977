import { Controller, Get } from '@nestjs/common';
import { CookingDurationsService } from './cooking-durations.service';

@Controller('cooking-durations')
export class CookingDurationsController {
  constructor(private readonly cookingDurationsService: CookingDurationsService) {}

  @Get()
  findAll() {
    return this.cookingDurationsService.findAll();
  }
}
