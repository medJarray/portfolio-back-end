import { ApiProperty } from '@nestjs/swagger';

export class SkillResponseDto {
    @ApiProperty({
        description: 'Skill unique identifier',
        example: '507f1f77bcf86cd799439011'
    })
    readonly id: string;

    @ApiProperty({
        description: 'Skill name',
        example: 'TypeScript'
    })
    readonly name: string;

    @ApiProperty({
        description: 'Skill category',
        example: 'Frontend Development'
    })
    readonly category: string;

    @ApiProperty({
        description: 'Skill level (1-3)',
        example: 2,
        minimum: 1,
        maximum: 3
    })
    readonly level: number;

    @ApiProperty({
        description: 'Skill description',
        example: 'Advanced knowledge in TypeScript development'
    })
    readonly description: string;

    @ApiProperty({
        description: 'Creation date',
        example: '2023-12-01T10:00:00Z'
    })
    readonly createdAt: string;

    @ApiProperty({
        description: 'Last update date',
        example: '2023-12-01T10:00:00Z'
    })
    readonly updatedAt: string;
}