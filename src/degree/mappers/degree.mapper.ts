import { Injectable, Logger } from '@nestjs/common';
import { DegreeResponseDto } from '../dto/degree-response.dto';
import { DegreeDocument } from '../schemas/degree.schema';
import { CreateDegreeDto } from '../dto/create-degree.dto';
import { UpdateDegreeDto } from '../dto/update-degree.dto';

@Injectable()
export class DegreeMapper {
  private readonly logger = new Logger(DegreeMapper.name);

  /**
   * Transform a single document into a DTO
   * @param document The degree document to transform
   * @returns The transformed DegreeResponseDto
   * @throws Error if the document is null or undefined
   * @throws Error if the mapping fails
   */
  toResponseDto(document: DegreeDocument): DegreeResponseDto {
    if (!document) {
      this.logger.error('Document is null or undefined in toResponseDto');
      throw new Error('Document cannot be null or undefined');
    }

    try {
      return {
        id: document._id.toString(),
        title: document.title,
        institution: document.institution,
        location: document.location,
        startDate: document.startDate.toISOString(),
        endDate: document.endDate?.toISOString(),
        fieldOfStudy: document.fieldOfStudy,
        grade: document.grade,
        isCurrent: document.isCurrent,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
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
   * @param documents The array of degree documents to transform
   * @returns The array of transformed DegreeResponseDto
   * @throws Error if the documents parameter is not an array
   * @throws Error if the mapping fails for any document
   */
  toResponseDtoArray(documents: DegreeDocument[]): DegreeResponseDto[] {
    if (!Array.isArray(documents)) {
      this.logger.error('Documents parameter is not an array');
      throw new Error('Documents must be an array');
    }

    return documents.map((doc) => this.toResponseDto(doc));
  }

  /**
   * Prepare the data for creating a document
   * @param dto The DTO containing the data to create a new degree
   * @returns The data to be used for creating a new degree document
   * @throws Error if the mapping fails
   */
  toCreateData(dto: CreateDegreeDto): Partial<DegreeDocument> {
    try {
      return {
        title: dto.title.trim(),
        institution: dto.institution.trim(),
        location: dto.location.trim(),
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        fieldOfStudy: dto.fieldOfStudy?.trim(),
        grade: dto.grade?.trim(),
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
   * @param dto The DTO containing the data to update an existing degree
   * @returns The data to be used for updating an existing degree document
   * @throws Error if the mapping fails
   */
  toUpdateData(dto: UpdateDegreeDto): Partial<DegreeDocument> {
    try {
      const updateData: Partial<DegreeDocument> = {};

      if (dto.title !== undefined) {
        updateData.title = dto.title.trim();
      }

      if (dto.institution !== undefined) {
        updateData.institution = dto.institution.trim();
      }

      if (dto.fieldOfStudy !== undefined) {
        updateData.fieldOfStudy = dto.fieldOfStudy?.trim();
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
