import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './experience.entity';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }

  @Post()
  create(@Body() experience: Partial<Experience>) {
    return this.experienceService.create(experience);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() experience: Partial<Experience>) {
    return this.experienceService.update(+id, experience);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(+id);
  }
} 