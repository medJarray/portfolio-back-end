import { Injectable, Logger } from '@nestjs/common';
import { ExperienceDocument } from '../schemas/experience.schema';
import { ExperienceResponseDto } from '../dto/experience-response.dto';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { UpdateExperienceDto } from '../dto/update-experience.dto';

@Injectable()
export class ExperienceMapper {
  private readonly logger = new Logger(ExperienceMapper.name);

  /**
   * Transform a single document into a DTO
   * @param document The experience document to transform
   * @returns The transformed ExperienceResponseDto
   * @throws Error if the document is null or undefined
   * @throws Error if the mapping fails
   */
  toResponseDto(document: ExperienceDocument): ExperienceResponseDto {
    if (!document) {
      this.logger.error('Document is null or undefined in toResponseDto');
      throw new Error('Document cannot be null or undefined');
    }

    try {
      return {
        id: document._id.toString(),
        title: document.title,
        company: document.company,
        location: document.location,
        startDate: document.startDate.toISOString(),
        endDate: document.endDate ? document.endDate.toISOString() : undefined,
        description: document.description || '',
        technologies: document.technologies || [],
        isCurrent: document.isCurrent || false,
        createdAt: document.createdAt?.toISOString(),
        updatedAt: document.updatedAt?.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Error mapping document to DTO: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to map document to response DTO');
    }
  }

  /**
   * Transform an array of documents into an array of DTOs
   * @param documents The array of experience documents to transform
   * @returns The array of transformed ExperienceResponseDto
   * @throws Error if the documents parameter is not an array
   * @throws Error if the mapping fails for any document
   */
  toResponseDtoArray(documents: ExperienceDocument[]): ExperienceResponseDto[] {
    if (!Array.isArray(documents)) {
      this.logger.error('Documents parameter is not an array');
      throw new Error('Documents must be an array');
    }

    return documents.map((doc) => this.toResponseDto(doc));
  }

  /**
   * Prepare the data for creating a document
   * @param dto The DTO containing the data to create a new experience
   * @returns The data to be used for creating a new experience document
   * @throws Error if the mapping fails
   */
  toCreateData(dto: CreateExperienceDto): Partial<ExperienceDocument> {
    try {
      return {
        title: dto.title.trim(),
        company: dto.company.trim(),
        location: dto.location?.trim() || '',
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description?.trim() || '',
        technologies: dto.technologies || [],
        isCurrent: dto.isCurrent || false,
      };
    } catch (error) {
      this.logger.error(
        `Error mapping create DTO: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to map create DTO to document data');
    }
  }

  /**
   * Prepare the data for updating a document
   * @param dto The DTO containing the data to update an existing experience
   * @returns The data to be used for updating an existing experience document
   * @throws Error if the mapping fails
   */
  toUpdateData(dto: UpdateExperienceDto): Partial<ExperienceDocument> {
    try {
      const updateData: Partial<ExperienceDocument> = {};

      if (dto.title !== undefined) {
        updateData.title = dto.title.trim();
      }

      if (dto.company !== undefined) {
        updateData.company = dto.company.trim();
      }

      if (dto.location !== undefined) {
        updateData.location = dto.location?.trim() || '';
      }

      if (dto.startDate !== undefined) {
        updateData.startDate = new Date(dto.startDate);
      }

      if (dto.endDate !== undefined) {
        updateData.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
      }
      if (dto.description !== undefined) {
        updateData.description = dto.description.trim() || '';
      }

      return updateData;
    } catch (error) {
      this.logger.error(
        `Error mapping update DTO: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to map update DTO to document data');
    }
  }
}
