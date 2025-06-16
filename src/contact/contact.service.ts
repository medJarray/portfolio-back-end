import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<Contact> {
    return this.contactRepository.findOneBy({ id });
  }

  create(contact: Partial<Contact>): Promise<Contact> {
    const newContact = this.contactRepository.create(contact);
    return this.contactRepository.save(newContact);
  }

  async update(id: number, contact: Partial<Contact>): Promise<Contact> {
    await this.contactRepository.update(id, contact);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.contactRepository.delete(id);
  }

  async markAsRead(id: number): Promise<Contact> {
    await this.contactRepository.update(id, { isRead: true });
    return this.findOne(id);
  }
} 