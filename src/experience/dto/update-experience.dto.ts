import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceDto } from './create-experience.dto';

// PartialType to inherit properties from CreateExperienceDto and make them optional
export class UpdateExperienceDto extends PartialType(CreateExperienceDto) { }