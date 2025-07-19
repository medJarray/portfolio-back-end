import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    IsEnum,
    IsOptional,
    Length
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum SkillCategory {
    FRONTEND = 'Frontend Development',
    BACKEND = 'Backend Development',
    DEVOPS = 'Tools & DevOps',
    SOFT = 'Soft Skills',
}

export class CreateSkillDto {
    @ApiProperty({
        description: 'Skill name',
        example: 'TypeScript',
        minLength: 1,
        maxLength: 100
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
    @Transform(({ value }) => value?.trim())
    readonly name: string;

    @ApiProperty({
        description: 'Skill category',
        enum: SkillCategory,
        example: SkillCategory.FRONTEND
    })
    @IsEnum(SkillCategory, { message: 'Category must be a valid skill category' })
    readonly category: SkillCategory;

    @ApiProperty({
        description: 'Skill level from 1 (beginner) to 3 (advanced)',
        minimum: 1,
        maximum: 3,
        example: 2
    })
    @IsNumber({}, { message: 'Level must be a number' })
    @Type(() => Number)
    @Min(1, { message: 'Level must be at least 1' })
    @Max(3, { message: 'Level must be at most 3' })
    readonly level: number;

    @ApiProperty({
        description: 'Skill description',
        required: false,
        maxLength: 500,
        example: 'Advanced knowledge in TypeScript development'
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @Length(0, 500, { message: 'Description must be at most 500 characters' })
    @Transform(({ value }) => value?.trim() || '')
    readonly description?: string;
}