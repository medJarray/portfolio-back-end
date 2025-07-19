import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Developer',
    required: true,
    maxLength: 200,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Company name',
    example: 'TechCorp',
    required: true,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200, {
    message: 'Company name must be between 1 and 200 characters',
  })
  @Transform(({ value }) => value?.trim())
  company: string;

  @ApiProperty({
    description: 'Job description',
    example: 'Developed web applications...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 500, { message: 'Description must be up to 500 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Start date',
    example: '2023-01-15T00:00:00.000Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @ApiProperty({
    description: 'End date',
    example: '2023-12-31T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty({ message: 'End date must be a valid date if provided' })
  endDate?: Date;

  @ApiProperty({
    description: 'Work locations',
    example: ['Paris', 'Remote'],
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Location must be a valid string if provided' })
  @Length(0, 200, { message: 'Location must be up to 200 characters' })
  @Transform(({ value }) => value?.trim())
  location?: string;

  @ApiProperty({
    description: 'Technologies used',
    example: ['React', 'NestJS', 'MongoDB'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value?.map((v: string) => v.trim()))
  technologies?: string[];

  @ApiProperty({
    description: 'Is current job',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
