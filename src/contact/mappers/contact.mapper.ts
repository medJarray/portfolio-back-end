import { Injectable, Logger } from '@nestjs/common';
import { ContactDocument, Address } from '../schemas/contact.schema';
import { AddressDto, CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { AddressResponseDto, ContactResponseDto } from '../dto/contact-response.dto';

@Injectable()
export class ContactMapper {
    private readonly logger = new Logger(ContactMapper.name);

    /**
     * Transform a single document into a DTO
     * @param document The contact document to transform
     * @returns The transformed ContactResponseDto
     */
    toResponseDto(document: ContactDocument): ContactResponseDto {
        if (!document) {
            this.logger.error('Document is null or undefined in toResponseDto');
            throw new Error('Document cannot be null or undefined');
        }

        try {
            return {
                id: document._id.toString(),
                phone: document.phone,
                email: document.email,
                address: this.mapAddressToResponseDto(document.address),
                createdAt: document.createdAt?.toISOString(),
                updatedAt: document.updatedAt?.toISOString(),
            };
        } catch (error) {
            this.logger.error(`Error mapping contact document to DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map contact document to response DTO');
        }
    }

    /**
     * Transform a list of documents into a list of DTOs
     * @param documents The array of contact documents to transform
     * @returns The array of transformed ContactResponseDto
     */
    toResponseDtoArray(documents: ContactDocument[]): ContactResponseDto[] {
        if (!Array.isArray(documents)) {
            this.logger.error('Documents parameter is not an array');
            throw new Error('Documents must be an array');
        }

        return documents.map(doc => this.toResponseDto(doc));
    }

    /**
     * Set up the data for creating a contact
     * @param dto The DTO containing the data to create a new contact
     * @returns The data to be used for creating a new contact document
     * @throws Error if the mapping fails
     */
    toCreateData(dto: CreateContactDto): Partial<ContactDocument> {
        try {
            return {
                phone: dto.phone.trim(),
                email: dto.email.trim().toLowerCase(),
                address: this.mapAddressDtoToMongo(dto.address),
            };
        } catch (error) {
            this.logger.error(`Error mapping create contact DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map create DTO to contact data');
        }
    }

    /**
     * Set up the data for updating a contact
     * @param dto The DTO containing the data to update a contact
     * @returns The data to be used for updating an existing contact document
     */
    toUpdateData(dto: UpdateContactDto): Partial<ContactDocument> {
        try {
            const updateData: Partial<ContactDocument> = {};

            if (dto.phone !== undefined) {
                updateData.phone = dto.phone.trim();
            }
            if (dto.email !== undefined) {
                updateData.email = dto.email.trim().toLowerCase();
            }
            if (dto.address !== undefined) {
                updateData.address = this.mapAddressDtoToMongo(dto.address);
            }

            return updateData;
        } catch (error) {
            this.logger.error(`Error mapping update contact DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map update DTO to contact data');
        }
    }

    // ==================== MÉTHODES PRIVÉES POUR ADDRESS ====================

    /**
     * Transform an Address MongoDB document into an AddressResponseDto
     * @param address The Address MongoDB document to transform
     * @returns The transformed AddressResponseDto
     */
    private mapAddressToResponseDto(address: Address): AddressResponseDto {
        if (!address) {
            this.logger.error('Address is null or undefined');
            throw new Error('Address cannot be null or undefined');
        }

        try {
            return {
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
            };
        } catch (error) {
            this.logger.error(`Error mapping address to response DTO: ${error.message}`, error.stack);
            throw new Error('Failed to map address to response DTO');
        }
    }

    /**
     * Transforme un AddressDto en Address MongoDB
     */
    private mapAddressDtoToMongo(addressDto: AddressDto): Address {
        if (!addressDto) {
            this.logger.error('AddressDto is null or undefined');
            throw new Error('AddressDto cannot be null or undefined');
        }

        try {
            return {
                street: addressDto.street.trim(),
                city: addressDto.city.trim(),
                state: addressDto.state.trim(),
                zipCode: addressDto.zipCode,
                country: addressDto.country.trim(),
            };
        } catch (error) {
            this.logger.error(`Error mapping address DTO to MongoDB: ${error.message}`, error.stack);
            throw new Error('Failed to map address DTO to MongoDB format');
        }
    }
}