import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  @Post()
  create(@Body() skill: Partial<Skill>) {
    return this.skillService.create(skill);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() skill: Partial<Skill>) {
    return this.skillService.update(+id, skill);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
} 