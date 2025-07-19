import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactResponseDto } from './dto/contact-response.dto';
import { Contact } from './schemas/contact.schema';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all contacts',
    type: [ContactResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacts not found',
  })
  @ApiTags('contacts')
  async findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the contact',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contact not found',
  })
  @ApiTags('contacts')
  async findOne(@Param('id') id: string) {
    return this.contactService.findById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Contact successfully created',
    type: ContactResponseDto,
  })
  @ApiTags('contacts')
  @ApiBody({ type: Contact })
  async create(@Body() createContactDto: Partial<CreateContactDto>) {
    return this.contactService.create(createContactDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing contact' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contact successfully updated',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contact not found',
  })
  @ApiTags('contacts')
  @ApiBody({ type: Contact })
  @ApiParam({
    name: 'id',
    description: 'Contact ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: Partial<UpdateContactDto>,
  ) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contact successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contact not found',
  })
  @ApiTags('contacts')
  @ApiParam({
    name: 'id',
    description: 'Contact ID (ObjectId)',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  async remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
