import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import e from "express";


export class AddressResponseDto {
    @ApiProperty({
        description: 'Street address',
        example: '123 Main St',
        required: true
    })
    @IsString({ message: 'Street must be a string' })
    @IsNotEmpty({ message: 'Street is required' })
    street: string;

    @ApiProperty({
        description: 'City',
        example: 'Anytown',
        required: true
    })
    @IsString({ message: 'City must be a string' })
    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @ApiProperty({
        description: 'State or province',
        example: 'CA',
        required: true
    })
    @IsString({ message: 'State must be a string' })
    @IsNotEmpty({ message: 'State is required' })
    state: string;

    @ApiProperty({
        description: 'Country',
        example: 'USA',
        required: true
    })
    @IsString({ message: 'Country must be a string' })
    @IsNotEmpty({ message: 'Country is required' })
    country: string;

    @ApiProperty({
        description: 'Zip code',
        example: '12345',
        required: true
    })
    @IsNumber({}, { message: 'Zip code must be a number' })
    @IsNotEmpty({ message: 'Zip code is required' })
    zipCode: number;
}

export class ContactResponseDto {
    @ApiProperty({
        description: 'The unique identifier of the contact',
        example: '60c72b2f9b1d8c001c8e4f3a',
        required: true
    })
    id: string;

    @ApiProperty({
        description: 'The phone number of the contact',
        example: '+1234567890',
        required: true
    })
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString()
    phone: string;

    @ApiProperty({
        description: 'The email address of the contact',
        example: 'john.doe@example.com',
        required: true
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'The physical address of the contact',
        example: '123 Main St, Anytown, USA',
        required: true
    })
    @IsNotEmpty({ message: 'Address is required' })
    address: AddressResponseDto;

    @ApiProperty({
        description: 'The creation date of the contact',
        example: '2023-01-01T00:00:00.000Z',
        required: true
    })
    createdAt: string;

    @ApiProperty({
        description: 'The last update date of the contact',
        example: '2023-01-02T00:00:00.000Z',
        required: true
    })
    updatedAt: string;
}