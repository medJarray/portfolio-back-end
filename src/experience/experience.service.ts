import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  findAll(): Promise<Experience[]> {
    return this.experienceRepository.find({
      order: {
        startDate: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<Experience> {
    return this.experienceRepository.findOneBy({ id });
  }

  create(experience: Partial<Experience>): Promise<Experience> {
    const newExperience = this.experienceRepository.create(experience);
    return this.experienceRepository.save(newExperience);
  }

  async update(id: number, experience: Partial<Experience>): Promise<Experience> {
    await this.experienceRepository.update(id, experience);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.experienceRepository.delete(id);
  }
} 