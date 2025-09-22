import { PartialType } from '@nestjs/mapped-types';
import { CreateDifficultyDto } from './create-difficulty.dto';

export class UpdateDifficultyDto extends PartialType(CreateDifficultyDto) {}
