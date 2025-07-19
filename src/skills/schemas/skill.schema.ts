import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'skills'
})
export class Skill {
    @Prop({
        required: true,
        trim: true,
        maxlength: 100,
        index: true
    })
    name: string;

    @Prop({
        required: true,
        enum: ['Frontend Development', 'Backend Development', 'Tools & DevOps', 'Soft Skills'],
        index: true
    })
    category: string;

    @Prop({
        required: true,
        min: 1,
        max: 3,
        type: Number
    })
    level: number;

    @Prop({
        required: false,
        trim: true,
        maxlength: 500
    })
    description?: string;

    createdAt: Date;
    updatedAt: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);

// Index composites pour performance
SkillSchema.index({ category: 1, level: 1 });
SkillSchema.index({ isActive: 1, createdAt: -1 });
SkillSchema.index({ name: 1 }, { unique: true });

export type SkillDocument = Skill & Document;