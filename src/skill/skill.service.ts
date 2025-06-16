import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  findAll(): Promise<Skill[]> {
    return this.skillRepository.find({
      order: {
        category: 'ASC',
        level: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<Skill> {
    return this.skillRepository.findOneBy({ id });
  }

  create(skill: Partial<Skill>): Promise<Skill> {
    const newSkill = this.skillRepository.create(skill);
    return this.skillRepository.save(newSkill);
  }

  async update(id: number, skill: Partial<Skill>): Promise<Skill> {
    await this.skillRepository.update(id, skill);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }
} 