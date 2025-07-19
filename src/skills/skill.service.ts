import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { SkillMapper } from './mappers/skill.mapper';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<SkillDocument>,
    private readonly skillMapper: SkillMapper,
  ) { }

  /**
   * Retrieve all skills
   * @returns An array of SkillResponseDto
   */
  async findAll(): Promise<SkillResponseDto[]> {
    try {
      this.logger.log('Retrieving all skills');

      const skills = await this.skillModel
        .find()
        .sort({ category: 1, level: -1, name: 1 })
        .lean()
        .exec();

      this.logger.log(`Found ${skills.length} skills`);

      return this.skillMapper.toResponseDtoArray(skills as SkillDocument[]);
    } catch (error) {
      this.logger.error(`Failed to retrieve skills: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to retrieve skills',
        error.message
      );
    }
  }

  /**
   * Retrieve a skill by its ID
   */
  async findById(id: string): Promise<SkillResponseDto> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Retrieving skill with ID: ${id}`);

      const skill = await this.skillModel
        .findOne({ _id: id })
        .lean()
        .exec();

      if (!skill) {
        this.logger.warn(`Skill with ID ${id} not found`);
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return this.skillMapper.toResponseDto(skill as SkillDocument);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve skill ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to retrieve skill',
        error.message
      );
    }
  }

  /**
   * Create a new skill
   * @param createSkillDto The DTO containing the data to create a new skill
   * @returns The created skill as a SkillResponseDto
   */
  async create(createSkillDto: CreateSkillDto): Promise<SkillResponseDto> {
    try {
      this.logger.log(`Creating new skill: ${createSkillDto.name}`);

      // Check name uniqueness
      await this.checkNameUniqueness(createSkillDto.name);

      const skillData = this.skillMapper.toCreateData(createSkillDto);
      const createdSkill = new this.skillModel(skillData);
      const savedSkill = await createdSkill.save();

      this.logger.log(`Skill created successfully with ID: ${savedSkill._id}`);

      return this.skillMapper.toResponseDto(savedSkill);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        this.logger.error(`Validation error creating skill: ${error.message}`);
        throw new BadRequestException('Invalid skill data', error.message);
      }

      this.logger.error(`Failed to create skill: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to create skill',
        error.message
      );
    }
  }

  /**
   * Update an existing skill
   */
  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<SkillResponseDto> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Updating skill with ID: ${id}`);

      // Check name uniqueness if modified
      if (updateSkillDto.name) {
        await this.checkNameUniqueness(updateSkillDto.name, id);
      }

      const updateData = this.skillMapper.toUpdateData(updateSkillDto);

      const updatedSkill = await this.skillModel
        .findOneAndUpdate(
          { _id: id, isActive: true },
          {
            ...updateData,
            updatedAt: new Date()
          },
          {
            new: true,
            runValidators: true,
            lean: true
          }
        )
        .exec();

      if (!updatedSkill) {
        this.logger.warn(`Skill with ID ${id} not found for update`);
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      this.logger.log(`Skill updated successfully: ${id}`);

      return this.skillMapper.toResponseDto(updatedSkill as SkillDocument);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        this.logger.error(`Validation error updating skill: ${error.message}`);
        throw new BadRequestException('Invalid skill data', error.message);
      }

      this.logger.error(`Failed to update skill ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to update skill',
        error.message
      );
    }
  }

  /**
   * Hard delete a skill by its ID
   */
  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Hard deleting skill with ID: ${id}`);
      const result = await this.skillModel
        .deleteOne({ _id: id })
        .lean()
        .exec();

      if (result.deletedCount === 0) {
        this.logger.warn(`Skill with ID ${id} not found for deletion`);
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      this.logger.log(`Skill hard deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete skill ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to delete skill',
        error.message
      );
    }
  }

  /**
   * Retrieve skills by category
   */
  async findByCategory(category: string): Promise<SkillResponseDto[]> {
    try {
      this.logger.log(`Retrieving skills for category: ${category}`);

      const skills = await this.skillModel
        .find({ category })
        .sort({ level: -1, name: 1 })
        .lean()
        .exec();

      this.logger.log(`Found ${skills.length} skills in category ${category}`);

      return this.skillMapper.toResponseDtoArray(skills as SkillDocument[]);
    } catch (error) {
      this.logger.error(`Failed to retrieve skills by category: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to retrieve skills by category',
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

  /**
   * Check name uniqueness for a skill
   */
  private async checkNameUniqueness(name: string, excludeId?: string): Promise<void> {
    try {
      const query: any = {
        name: new RegExp(`^${name.trim()}$`, 'i'),
        isActive: true
      };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existingSkill = await this.skillModel.findOne(query).lean().exec();

      if (existingSkill) {
        this.logger.warn(`Skill name already exists: ${name}`);
        throw new ConflictException(`Skill with name '${name}' already exists`);
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error checking name uniqueness: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to validate skill name uniqueness');
    }
  }
}