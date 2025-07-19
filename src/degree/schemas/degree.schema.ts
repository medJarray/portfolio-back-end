import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean } from "class-validator";
import { Document } from 'mongoose';


@Schema({
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'degrees',
    versionKey: false
})
export class Degree {
    @Prop({
        required: true,
        trim: true
    })
    title: string;

    @Prop({
        required: true,
        trim: true
    })
    institution: string;

    @Prop({
        required: true,
        trim: true
    })
    description?: string;

    @Prop({
        required: true,
        trim: true
    })
    location: string;

    @Prop({
        required: true,
        type: Date
    })
    startDate: Date;

    @Prop({
        required: true,
        type: Date
    })
    endDate?: Date;

    @Prop({
        required: true,
        trim: true
    })
    fieldOfStudy?: string;

    @Prop({
        required: true,
        trim: true
    })
    grade?: string;

    @Prop({
        type: Boolean,
        default: false
    })
    @IsBoolean()
    isCurrent?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);

export type DegreeDocument = Degree & Document;