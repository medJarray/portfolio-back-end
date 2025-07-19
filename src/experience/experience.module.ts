import { Module } from '@nestjs/common';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceMapper } from './mappers/experience.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
  ],
  providers: [ExperienceService, ExperienceMapper],
  controllers: [ExperienceController],
  exports: [ExperienceService, ExperienceMapper],
})
export class ExperienceModule {}
