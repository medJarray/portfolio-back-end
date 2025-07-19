import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { DegreeResponseDto } from './dto/degree-response.dto';
import { Degree, DegreeDocument } from './schemas/degree.schema';
import { DegreeMapper } from './mappers/degree.mapper';

@Injectable()
export class DegreeService {
  private readonly logger = new Logger(DegreeService.name);

  constructor(
    @InjectModel(Degree.name)
    private readonly degreeModel: Model<DegreeDocument>,
    private readonly degreeMapper: DegreeMapper,
  ) {}

  /**
   * Retrieve all degrees
   * @returns An array of degree response DTOs
   */
  async findAll(): Promise<DegreeResponseDto[]> {
    try {
      this.logger.log('Retrieving all degrees');
      const degrees = await this.degreeModel
        .find()
        .sort({ startDate: -1, endDate: -1 })
        .lean()
        .exec();

      this.logger.log(`Found ${degrees.length} degrees`);
      return this.degreeMapper.toResponseDtoArray(degrees as DegreeDocument[]);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve degrees: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException('Failed to retrieve degrees', error.message);
    }
  }

  /**
   * Retrieve a degree by ID
   * @param id The ID of the degree to retrieve
   * @returns The degree response DTO
   */
  async findById(id: string): Promise<DegreeResponseDto> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Retrieving degree with ID: ${id}`);

      const degree = await this.degreeModel.findOne({ _id: id }).lean().exec();

      if (!degree) {
        this.logger.warn(`Degree with ID ${id} not found`);
        throw new NotFoundException(`Degree with ID ${id} not found`);
      }
      return this.degreeMapper.toResponseDto(degree);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve degree: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Failed to retrieve degree with ID ${id}`,
        error.message,
      );
    }
  }

  /**
   * Create a new degree
   * @param createDegreeDto The DTO containing the data to create a new degree
   * @returns The created DegreeResponseDto
   */
  async create(createDegreeDto: CreateDegreeDto): Promise<DegreeResponseDto> {
    try {
      this.logger.log(
        'Creating a new degree: ' + JSON.stringify(createDegreeDto),
      );

      const degreeData = this.degreeMapper.toCreateData(createDegreeDto);
      const newDegree = new this.degreeModel(degreeData);
      const savedDegree = await newDegree.save();

      this.logger.log(`Degree created with ID: ${savedDegree._id}`);

      return this.degreeMapper.toResponseDto(savedDegree);
    } catch (error) {
      this.logger.error(
        `Failed to create degree: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create degree', error.message);
    }
  }

  /**
   * Update a degree by ID
   * @param id The ID of the degree to update
   * @param updateDegreeDto The DTO containing the updated degree data
   * @returns The updated degree response DTO
   */
  async update(
    id: string,
    updateDegreeDto: UpdateDegreeDto,
  ): Promise<DegreeResponseDto> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Updating degree with ID: ${id}`);
      const updateData = this.degreeMapper.toUpdateData(updateDegreeDto);
      const updateDegree = await this.degreeModel.findOneAndUpdate(
        { _id: id },
        {
          ...updateData,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
          lean: true,
        },
      );

      if (!updateDegree) {
        this.logger.warn(`Degree with ID ${id} not found`);
        throw new NotFoundException(`Degree with ID ${id} not found`);
      }

      this.logger.log(
        `Degree updated successfully with ID: ${updateDegree._id}`,
      );
      return this.degreeMapper.toResponseDto(updateDegree);
    } catch (error) {
      this.logger.error(
        `Failed to update degree: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update degree', error.message);
    }
  }

  /**
   * Remove a degree by ID
   * @param id The ID of the degree to remove
   */
  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Removing degree with ID: ${id}`);
      const result = await this.degreeModel
        .deleteOne({ _id: id })
        .lean()
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`Degree with ID ${id} not found`);
      }
      this.logger.log(`Degree with ID ${id} removed successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to remove degree: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Failed to remove degree with ID ${id}`,
        error.message,
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
