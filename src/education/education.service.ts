import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
  ) {}

  findAll(): Promise<Education[]> {
    return this.educationRepository.find({
      order: {
        startDate: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<Education> {
    return this.educationRepository.findOneBy({ id });
  }

  create(education: Partial<Education>): Promise<Education> {
    const newEducation = this.educationRepository.create(education);
    return this.educationRepository.save(newEducation);
  }

  async update(id: number, education: Partial<Education>): Promise<Education> {
    await this.educationRepository.update(id, education);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.educationRepository.delete(id);
  }
} 