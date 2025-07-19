import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'contacts',
  versionKey: false,
})
export class Address {
  @Prop({
    required: true,
    trim: true,
  })
  street: string;

  @Prop({
    required: true,
    trim: true,
  })
  city: string;

  @Prop({
    required: true,
    trim: true,
  })
  state: string;

  @Prop({
    required: true,
    trim: true,
  })
  zipCode: number;

  @Prop({
    required: true,
    trim: true,
  })
  country: string;
}

export class Contact extends Document {
  @Prop({
    required: true,
    trim: true,
    unique: true,
    match: /^\+?[1-9]\d{1,14}$/,
  })
  phone: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    loadClass: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    type: Address,
  })
  address: Address;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

export type ContactDocument = Contact & Document;
