import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContactResponseDto } from './dto/contact-response.dto';
import { Contact } from './schemas/contact.schema';
import { Model, Types } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactMapper } from './mappers/contact.mapper';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
    private readonly contactMapper: ContactMapper,
  ) {}

  async findAll(): Promise<ContactResponseDto[]> {
    const contacts = await this.contactModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return contacts.map((contact) => this.contactMapper.toResponseDto(contact));
  }

  async findById(id: number): Promise<ContactResponseDto> {
    const contact = await this.contactModel.findById(id).exec();
    return this.contactMapper.toResponseDto(contact);
  }

  /**
   * Create a new contact
   * @param contact The data to create a new contact
   * @returns The created ContactResponseDto
   * @throws InternalServerErrorException if the creation fails
   */
  async create(
    contact: Partial<CreateContactDto>,
  ): Promise<ContactResponseDto> {
    try {
      this.logger.log(`Creating a new contact: ${JSON.stringify(contact)}`);

      const contactData = this.contactMapper.toCreateData(
        contact as CreateContactDto,
      );
      const newContact = new this.contactModel(contactData);
      const savedContact = await newContact.save();

      this.logger.log(`Contact created with ID: ${savedContact._id}`);

      return this.contactMapper.toResponseDto(savedContact);
    } catch (error) {
      this.logger.error(
        `Failed to create contact: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create contact',
        error.message,
      );
    }
  }

  /**
   * Update an existing contact
   * @param id The ID of the contact to update
   * @param updateContactDto The data to update the contact
   * @returns The updated ContactResponseDto
   * @throws NotFoundException if the contact is not found
   */
  async update(
    id: string,
    updateContactDto: Partial<UpdateContactDto>,
  ): Promise<ContactResponseDto> {
    this.validateObjectId(id);

    try {
      this.logger.log(`Updating contact with ID: ${id}`);

      const contactData = this.contactMapper.toUpdateData(updateContactDto);
      const updatedContact = await this.contactModel
        .findByIdAndUpdate(
          { _id: id },
          { ...contactData, updatedAt: new Date() },
          { new: true, runValidators: true, lean: true },
        )
        .exec();

      if (!updatedContact) {
        this.logger.warn(`Contact with ID ${id} not found`);
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      this.logger.log(`Contact with ID ${id} updated successfully`);

      return this.contactMapper.toResponseDto(updatedContact);
    } catch (error) {
      this.logger.error(
        `Failed to update contact: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update contact',
        error.message,
      );
    }
  }

  /**
   * Delete a contact by ID
   * @param id The ID of the contact to delete
   */
  async remove(id: number): Promise<void> {
    this.validateObjectId(id.toString());

    try {
      this.logger.log(`Deleting contact with ID: ${id}`);

      const result = await this.contactModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete contact: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete contact',
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
