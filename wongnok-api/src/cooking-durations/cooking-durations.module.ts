import { Module } from '@nestjs/common';
import { CookingDurationsService } from './cooking-durations.service';
import { CookingDurationsController } from './cooking-durations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookingDuration } from './entities/cooking-duration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CookingDuration])],
  controllers: [CookingDurationsController],
  providers: [CookingDurationsService],
})
export class CookingDurationsModule {}
