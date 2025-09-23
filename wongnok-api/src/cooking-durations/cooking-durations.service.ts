import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CookingDuration } from './entities/cooking-duration.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CookingDurationsService implements OnModuleInit {
  constructor(
    @InjectRepository(CookingDuration)
    private readonly repository: Repository<CookingDuration>,
  ) {}

  // for init to create data
  async onModuleInit() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save([
        { name: '5 - 10' },
        { name: '11 - 30' },
        { name: '31 - 60' },
        { name: '61+' },
      ]);
    }
  }


  findAll() {
    return this.repository.find();
  }
}
