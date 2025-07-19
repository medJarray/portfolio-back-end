import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new skill',
    description: 'Creates a new skill with the provided information. Skill name must be unique.'
  })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill created successfully',
    type: SkillResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation error'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Skill with this name already exists'
  })
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  async create(@Body() createSkillDto: CreateSkillDto): Promise<SkillResponseDto> {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active skills',
    description: 'Retrieves all active skills sorted by category, then level (desc), then name'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter skills by category',
    enum: ['Frontend Development', 'Backend Development', 'Tools & DevOps', 'Soft Skills']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skills retrieved successfully',
    type: [SkillResponseDto]
  })
  async findAll(@Query('category') category?: string): Promise<SkillResponseDto[]> {
    if (category) {
      return this.skillService.findByCategory(category);
    }
    return this.skillService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get skill by ID',
    description: 'Retrieves a specific skill by its MongoDB ObjectId'
  })
  @ApiParam({
    name: 'id',
    description: 'Skill MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill retrieved successfully',
    type: SkillResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ObjectId format'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found'
  })
  async findOne(@Param('id') id: string): Promise<SkillResponseDto> {
    return this.skillService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update skill',
    description: 'Updates an existing skill with new information. Only provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    description: 'Skill MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateSkillDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill updated successfully',
    type: SkillResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ObjectId format or validation error'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Skill name already exists'
  })
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true
  }))
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete skill',
    description: 'Soft deletes a skill by marking it as inactive. The skill data is preserved.'
  })
  @ApiParam({
    name: 'id',
    description: 'Skill MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Skill deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ObjectId format'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.skillService.remove(id);
  }
}