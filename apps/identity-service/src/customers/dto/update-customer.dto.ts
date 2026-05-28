import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";

export class UpdateCustomerDto {
  @ApiProperty({
    description: "Name of the customer",
    example: "John",
  })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({
    description: "Gender of the customer",
    example: "Male",
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: "DOB of the customer",
    example: "01-01-1995",
  })
  @IsString()
  @IsNotEmpty()
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
}
