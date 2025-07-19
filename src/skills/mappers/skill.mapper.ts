import { Injectable, Logger } from '@nestjs/common';
import { SkillDocument } from '../schemas/skill.schema';
import { SkillResponseDto } from '../dto/skill-response.dto';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';

@Injectable()
export class SkillMapper {
    private readonly logger = new Logger(SkillMapper.name);

    /**
     * Transform a single document into a DTO
     * @param document The skill document to transform
     * @returns The transformed SkillResponseDto
     * @throws Error if the document is null or undefined
     * @throws Error if the mapping fails
     */
    toResponseDto(document: SkillDocument): SkillResponseDto {
        if (!document) {
            this.logger.error('Document is null or undefined in toResponseDto');
            throw new Error('Document cannot be null or undefined');
        }

        try {
            return {
                id: document._id.toString(),
                name: document.name,
                category: document.category,
                level: document.level,
                description: document.description || '',
                createdAt: document.createdAt.toISOString(),
                updatedAt: document.updatedAt.toISOString(),
            };
        } catch (error) {
            this.logger.error(`Error mapping document to DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map document to response DTO');
        }
    }

    /**
     * Transform an array of documents into an array of DTOs
     * @param documents The array of skill documents to transform
     * @returns The array of transformed SkillResponseDto
     * @throws Error if the documents parameter is not an array
     * @throws Error if the mapping fails for any document
     */
    toResponseDtoArray(documents: SkillDocument[]): SkillResponseDto[] {
        if (!Array.isArray(documents)) {
            this.logger.error('Documents parameter is not an array');
            throw new Error('Documents must be an array');
        }

        return documents.map(doc => this.toResponseDto(doc));
    }

    /**
     * Prepare the data for creating a document
     * @param dto The DTO containing the data to create a new skill
     * @returns The data to be used for creating a new skill document
     * @throws Error if the mapping fails
     */
    toCreateData(dto: CreateSkillDto): Partial<SkillDocument> {
        try {
            return {
                name: dto.name.trim(),
                category: dto.category,
                level: dto.level,
                description: dto.description?.trim() || '',
            };
        } catch (error) {
            this.logger.error(`Error mapping create DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map create DTO to document data');
        }
    }

    /**
     * Prepare the data for updating a document
     * * @param dto The DTO containing the data to update an existing skill
     * @returns The data to be used for updating an existing skill document
     * @throws Error if the mapping fails
     */
    toUpdateData(dto: UpdateSkillDto): Partial<SkillDocument> {
        try {
            const updateData: Partial<SkillDocument> = {};

            if (dto.name !== undefined) {
                updateData.name = dto.name.trim();
            }
            if (dto.category !== undefined) {
                updateData.category = dto.category;
            }
            if (dto.level !== undefined) {
                updateData.level = dto.level;
            }
            if (dto.description !== undefined) {
                updateData.description = dto.description.trim() || '';
            }

            return updateData;
        } catch (error) {
            this.logger.error(`Error mapping update DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map update DTO to document data');
        }
    }
}