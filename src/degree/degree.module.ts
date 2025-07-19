import { Module } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Degree, DegreeSchema } from './schemas/degree.schema';
import { DegreeMapper } from './mappers/degree.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Degree.name, schema: DegreeSchema }]),
  ],
  providers: [DegreeService, DegreeMapper],
  controllers: [DegreeController],
  exports: [DegreeService, DegreeMapper],
})
export class DegreeModule {}
