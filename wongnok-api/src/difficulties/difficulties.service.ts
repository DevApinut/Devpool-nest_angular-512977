import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';

@Injectable()
export class DifficultiesService {

  constructor(
    @InjectRepository(Difficulty)
    private readonly repository: Repository<Difficulty>
  ) { }

  // for init to create data
  async onModuleInit() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save([
        { name: 'Easy' },
        { name: 'Medium' },
        { name: 'Hard' },        
      ]);
    }
  }

  findAll() {
    return this.repository.find();
  }

}
