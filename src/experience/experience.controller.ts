import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponseDto } from './dto/experience-response.dto';

@ApiTags('Experiences')
@Controller('experiences')
@UsePipes(new ValidationPipe({ transform: true }))
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all experiences',
    description:
      'Retrieves a list of all experiences sorted by start date and end date.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all experiences',
    type: [ExperienceResponseDto],
  })
  async findAll(): Promise<ExperienceResponseDto[]> {
    return this.experienceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get experience by ID',
    description: 'Retrieves a specific experience by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the experience',
    type: ExperienceResponseDto,
  })
  findOne(@Param('id') id: string): Promise<ExperienceResponseDto> {
    return this.experienceService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new experience',
    description: 'Creates a new experience with the provided information.',
  })
  @ApiBody({ type: CreateExperienceDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Experience created successfully',
    type: ExperienceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    console.log('Creating experience:', createExperienceDto);
    return this.experienceService.create(createExperienceDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update experience',
    description: 'Updates an existing experience by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateExperienceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Experience updated successfully',
    type: ExperienceResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.experienceService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete experience',
    description: 'Deletes an existing experience by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Experience deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experience not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.experienceService.remove(id);
  }
}
