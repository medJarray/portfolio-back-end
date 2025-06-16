import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducationService } from './education.service';
import { Education } from './education.entity';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(+id);
  }

  @Post()
  create(@Body() education: Partial<Education>) {
    return this.educationService.create(education);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() education: Partial<Education>) {
    return this.educationService.update(+id, education);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationService.remove(+id);
  }
} 