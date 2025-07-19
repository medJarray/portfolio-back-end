import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  collection: 'experiences',
  versionKey: false,
})
export class Experience {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
    index: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
    index: true,
  })
  company: string;

  @Prop({
    required: false,
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
    type: Date,
  })
  startDate: Date;

  @Prop({
    required: false,
    type: Date,
  })
  endDate?: Date;

  @Prop({
    required: false,
    trim: true,
  })
  location?: string;

  @Prop({
    type: [String],
    default: [],
  })
  technologies?: string[];

  @Prop({
    required: false,
    default: false,
  })
  isCurrent?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);

ExperienceSchema.index({ company: 1, startDate: -1 });
ExperienceSchema.index({ technologies: 1 });

export type ExperienceDocument = Experience & Document;
