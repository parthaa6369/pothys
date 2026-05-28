import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  IsBoolean,
  IsArray,
  IsNumber,
  Min,
  Max,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";
import { Type } from "class-transformer";

export class CreateCustomerDto {
  @ApiProperty({
    description: "Name of the customer",
    example: "John",
  })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({
    description: "Mobile number of the customer",
    example: "9876543210",
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: "Mobile number must be exactly 10 digits" })
  mobile_number: string;

  @ApiPropertyOptional({
    description: "Whatsapp number of the customer",
    example: "9876543210",
  })
  @IsString()
  @IsOptional()
  whatsapp_number: string;

  @ApiProperty({
    description: "Email id of the customer",
    example: "john@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email_id: string;

  @ApiProperty({
    description: "Gender of the customer",
    example: "Male",
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: "City of the customer",
    example: "Madurai",
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "State of the customer",
    example: "Tamil nadu",
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "Address of the customer",
    example: "15-17,tpk,madurai-5",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "Pincode of the customer",
    example: "625005",
  })
  @IsNotEmpty()
  @IsString()
  pincode: string;

  @ApiPropertyOptional({
    description: "DOB of the customer",
    example: "01-01-1995",
  })
  @IsString()
  @IsOptional()
  dob: Date;

  @ApiPropertyOptional({
    description: "DOW of the customer",
    example: "01-01-2017",
  })
  @IsString()
  @IsOptional()
  dow: Date;

  @ApiPropertyOptional({
    description: "Marital status of the customer",
    example: "Married",
  })
  @IsString()
  @IsOptional()
  marital_status: string;

  @ApiProperty({
    description: "Agree for terms and conditions",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_agree: boolean;
}
