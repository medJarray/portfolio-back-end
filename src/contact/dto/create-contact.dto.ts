import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, Matches, IsEmail, ValidateNested, Min, Max, IsNumber, Length } from "class-validator";

export class AddressDto {
    @ApiProperty({
        description: 'Street address',
        example: '123 Main St',
        required: true
    })
    @IsString({ message: 'Street must be a string' })
    @IsNotEmpty({ message: 'Street is required' })
    @Length(1, 255, { message: 'Street must be between 1 and 255 characters' })
    @Transform(({ value }) => value?.trim())
    street: string;

    @ApiProperty({
        description: 'City',
        example: 'Anytown',
        required: true
    })
    @IsString({ message: 'City must be a string' })
    @IsNotEmpty({ message: 'City is required' })
    @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
    @Transform(({ value }) => value?.trim())
    city: string;

    @ApiProperty({
        description: 'State or province',
        example: 'CA',
        required: true
    })
    @IsString({ message: 'State must be a string' })
    @IsNotEmpty({ message: 'State is required' })
    @Length(2, 100, { message: 'State must be between 2 and 100 characters' })
    @Transform(({ value }) => value?.trim())
    state: string;

    @ApiProperty({
        description: 'Postal code',
        example: '12345',
        required: true
    })
    @IsNotEmpty({ message: 'Postal code is required' })
    @IsNumber({}, { message: 'Postal code must be a number' })
    @Min(0, { message: 'Postal code must be a positive number' })
    @Max(99999, { message: 'Postal code must be at most 5 digits' })
    zipCode: number;

    @ApiProperty({
        description: 'Country',
        example: 'USA',
    })
    @IsString({ message: 'Country must be a string' })
    @IsNotEmpty({ message: 'Country is required' })
    @Length(1, 100, { message: 'Country must be between 1 and 100 characters' })
    @Transform(({ value }) => value?.trim())
    country: string;
}

export class CreateContactDto {
    @ApiProperty({
        description: 'The phone number of the contact',
        example: '+1234567890',
    })
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international format' })
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString({ message: 'Phone number must be a string' })
    @Transform(({ value }) => value?.trim())
    phone: string;

    @ApiProperty({
        description: 'The email address of the contact',
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty({
        description: 'The physical address of the contact',
        example: '123 Main St, Anytown, USA',
    })
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
}





































