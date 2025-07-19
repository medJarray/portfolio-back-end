import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
// import { Not } from 'typeorm';

export class CreateDegreeDto {
  @ApiProperty({
    description: 'Degree title',
    example: 'Bachelor of Science in Computer Science',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Institution name',
    example: 'University of Example',
  })
  @IsNotEmpty({ message: 'Institution is required' })
  @IsString()
  institution: string;

  @ApiProperty({
    description: 'Description of the degree',
    example:
      'A comprehensive program covering various aspects of computer science.',
  })
  @IsOptional()
  @IsDateString()
  description?: string;

  @ApiProperty({
    description: 'Location of the degree',
    example: 'Example City, Country',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Start date of the degree',
    example: '2020-01-01',
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the degree',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    description: 'Field of study',
    example: 'Computer Science',
    required: false,
  })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({
    description: 'Grade received',
    example: 'First Class Honours',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    description: 'Indicates if the degree is current',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
