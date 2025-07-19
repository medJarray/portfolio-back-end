import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { DegreeResponseDto } from './dto/degree-response.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@ApiTags('degrees')
@Controller('degrees')
@UsePipes(new ValidationPipe({ transform: true }))
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) { }

  @Get()
  @ApiOperation({ summary: 'Get all degrees' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all degrees',
    type: [DegreeResponseDto]
  })
  async findAll(): Promise<DegreeResponseDto[]> {
    return this.degreeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get degree by ID' })
  @ApiParam({
    name: 'id',
    description: 'Degree ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the degree',
    type: DegreeResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Degree not found'
  })
  async findOne(@Param('id') id: string): Promise<DegreeResponseDto> {
    return this.degreeService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new degree' })
  @ApiBody({ type: CreateDegreeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Degree created successfully',
    type: DegreeResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  async create(@Body() createDegreeDto: CreateDegreeDto): Promise<DegreeResponseDto> {
    return this.degreeService.create(createDegreeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update degree' })
  @ApiParam({
    name: 'id',
    description: 'Degree ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateDegreeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Degree updated successfully',
    type: DegreeResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Degree not found'
  })
  async update(
    @Param('id') id: string,
    @Body() updateDegreeDto: UpdateDegreeDto
  ): Promise<DegreeResponseDto> {
    return this.degreeService.update(id, updateDegreeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete degree' })
  @ApiParam({
    name: 'id',
    description: 'Degree ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Experience deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experience not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.degreeService.remove(id);
  }
}