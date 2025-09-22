import { PartialType } from '@nestjs/mapped-types';
import { CreateCookingDurationDto } from './create-cooking-duration.dto';

export class UpdateCookingDurationDto extends PartialType(CreateCookingDurationDto) {}
