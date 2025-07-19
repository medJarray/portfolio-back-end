import { ApiProperty } from '@nestjs/swagger';

export class ExperienceResponseDto {
  @ApiProperty({
    description: 'Experience ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Software Engineer',
  })
  title: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Tech Corp',
  })
  company: string;

  @ApiProperty({
    description: 'Job description',
    example:
      'Developed and maintained web applications using modern technologies.',
  })
  description?: string;

  @ApiProperty({
    description: 'Start date',
    example: '2023-01-15T00:00:00.000Z',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date',
    example: '2023-12-31T00:00:00.000Z',
  })
  endDate?: string;

  @ApiProperty({
    description: 'Work locations',
    example: 'Paris, France',
  })
  location?: string;

  @ApiProperty({
    description: 'Technologies used',
    type: [String],
    example: ['JavaScript', 'Node.js'],
  })
  technologies?: string[];

  @ApiProperty({
    description: 'Is current job',
    example: false,
  })
  isCurrent?: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-15T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-15T00:00:00.000Z',
  })
  updatedAt: string;
}
