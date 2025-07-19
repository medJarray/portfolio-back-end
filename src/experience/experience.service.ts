import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { Experience, ExperienceDocument } from './schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponseDto } from './dto/experience-response.dto';
import { ExperienceMapper } from './mappers/experience.mapper';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
    private readonly experienceMapper: ExperienceMapper,
  ) { }

  /**
   * Retrieve all experiences
   * @returns An array of ExperienceResponseDto
   */
  async findAll(): Promise<ExperienceResponseDto[]> {
    try {
      this.logger.log('Retrieving all experiences');

      const experiences = await this.experienceModel
        .find()
        .sort({ startDate: -1, endDate: -1 })
        .lean()
        .exec();

      this.logger.log(`Found ${experiences.length} experiences`);

      return this.experienceMapper.toResponseDtoArray(experiences as ExperienceDocument[]);
    } catch (error) {
      this.logger.error(`Failed to retrieve experiences: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to retrieve experiences',
        error.message
      );
    }
  }

  /**
   * Retrieve an experience by its ID
   * @param id The ID of the experience to retrieve
   * @returns The ExperienceResponseDto for the specified ID
   */
  async findById(id: string): Promise<ExperienceResponseDto> {
    this.validateObjectId(id);
    try {
      this.logger.log(`Retrieving experience with ID: ${id}`);

      const experience = await this.experienceModel.findById(id).lean().exec();
      if (!experience) {
        this.logger.warn(`Experience with ID ${id} not found`);
        throw new NotFoundException(`Experience with ID ${id} not found`);
      }
      return this.experienceMapper.toResponseDto(experience);
    } catch (error) {
      this.logger.error(`Failed to retrieve experience with ID ${id}: ${error.message}`, error
        .stack);
      throw new InternalServerErrorException(
        `Failed to retrieve experience with ID ${id}`,
        error.message
      );
    }
  }

  /**
   * Create a new experience
   * @param createExperienceDto The DTO containing the data for the new experience
   * @returns The created ExperienceResponseDto
   */
  async create(createExperienceDto: CreateExperienceDto): Promise<ExperienceResponseDto> {
    try {
      this.logger.log(`Creating a new experience: ${JSON.stringify(createExperienceDto)}`);

      const experienceData = this.experienceMapper.toCreateData(createExperienceDto);
      const createdExperience = new this.experienceModel(experienceData);
      const savedExperience = await createdExperience.save();

      this.logger.log(`Experience created successfully with ID: ${savedExperience._id}`);

      return this.experienceMapper.toResponseDto(savedExperience);
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn(`Experience with title "${createExperienceDto.title}" already exists`);
        throw new ConflictException(`Experience with title "${createExperienceDto.title}" already exists`);
      }
      this.logger.error(`Failed to create experience: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to create experience',
        error.message
      );
    }
  }

  /**
   * Update an existing experience
   * @param id The ID of the experience to update
   * @param updateExperienceDto The DTO containing the updated data
   * @returns The updated ExperienceResponseDto
   */
  async update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<ExperienceResponseDto> {
    this.validateObjectId(id);
    try {
      this.logger.log(`Updating experience with ID: ${id}`);

      const updateData = this.experienceMapper.toUpdateData(updateExperienceDto);
      const updatedExperience = await this.experienceModel
        .findOneAndUpdate(
          { _id: id },
          {
            ...updateData,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
            lean: true,
          }
        );
      if (!updatedExperience) {
        throw new NotFoundException(`Experience with ID ${id} not found`);
      }
      this.logger.log(`Experience with ID ${id} updated successfully`);

      return this.experienceMapper.toResponseDto(updatedExperience);
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.logger.error(`Validation error updating experience: ${error.message}`);
        throw new BadRequestException('Invalid experience data', error.message);
      }
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        this.logger.warn(`Not found or conflict error updating experience: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error updating experience: ${error.message}`);
      throw new InternalServerErrorException('Failed to update experience', error.message);
    }
  }

  /**
   * Soft delete an experience by marking it as inactive
   * @param id The ID of the experience to delete
   */
  async remove(id: string): Promise<void> {
    this.validateObjectId(id);
    try {
      this.logger.log(`Soft deleting experience with ID: ${id}`);

      const result = await this.experienceModel
        .deleteOne({ _id: id })
        .lean()
        .exec();

      if (result.deletedCount === 0) {
        this.logger.warn(`Experience with ID ${id} not found for deletion`);
        throw new NotFoundException(`Experience with ID ${id} not found`);
      }

      this.logger.log(`Experience soft deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete experience ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to delete experience',
        error.message
      );
    }
  }

  // ==================== MÉTHODES PRIVÉES ====================

  /**
   * Validate that an ID is a valid MongoDB ObjectId
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid ObjectId provided: ${id}`);
      throw new BadRequestException(`Invalid ObjectId: ${id}`);
    }
  }
}