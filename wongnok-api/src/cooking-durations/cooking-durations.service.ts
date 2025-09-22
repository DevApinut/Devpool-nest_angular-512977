import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CookingDuration } from './entities/cooking-duration.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CookingDurationsService {

  constructor(
    @InjectRepository(CookingDuration) 
    private readonly repository: Repository<CookingDuration>
  ) {}

  findAll() {
    return this.repository.find();
  }
}
