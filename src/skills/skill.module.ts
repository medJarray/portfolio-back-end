import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schemas/skill.schema';
import { SkillMapper } from './mappers/skill.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  providers: [SkillService, SkillMapper],
  controllers: [SkillController],
  exports: [SkillService, SkillMapper],
})
export class SkillModule {}
