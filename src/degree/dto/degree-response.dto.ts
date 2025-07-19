import { ApiProperty } from '@nestjs/swagger';

export class DegreeResponseDto {
  @ApiProperty({
    description: 'Degree ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Degree title',
    example: 'Bachelor of Science in Computer Science',
  })
  title: string;

  @ApiProperty({
    description: 'Institution name',
    example: 'University of Example',
  })
  institution: string;

  @ApiProperty({
    description: 'Location of the degree',
    example: 'Example City, Country',
  })
  location: string;

  @ApiProperty({
    description: 'Description of the degree',
    example:
      'A comprehensive program covering various aspects of computer science.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Start date of the degree',
    example: '2020-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date of the degree',
    example: '2024-01-01',
    required: false,
  })
  endDate?: string;

  @ApiProperty({
    description: 'Field of study',
    example: 'Computer Science',
    required: false,
  })
  fieldOfStudy?: string;

  @ApiProperty({
    description: 'Grade received',
    example: 'First Class Honours',
    required: false,
  })
  grade?: string;

  @ApiProperty({
    description: 'Indicates if the degree is current',
    example: true,
    required: false,
  })
  isCurrent?: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2020-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2020-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
