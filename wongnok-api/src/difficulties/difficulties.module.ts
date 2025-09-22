import { Module } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { DifficultiesController } from './difficulties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Difficulty } from './entities/difficulty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Difficulty])],
  controllers: [DifficultiesController],
  providers: [DifficultiesService],
})
export class DifficultiesModule {}
