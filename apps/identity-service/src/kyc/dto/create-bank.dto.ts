import { IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";

export class AddBankDto {
  @ApiProperty({
    description: "Bank acc holder name",
    example: "John",
  })
  @IsNotEmpty()
  @IsString()
  account_holder_name: string;

  @ApiProperty({
    description: "Name of the bank",
    example: "HDFC",
  })
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty({
    description: "Bank branch name",
    example: "thirunagar,madurai",
  })
  @IsNotEmpty()
  @IsString()
  branch: string;

  @ApiProperty({
    description: "Branch ifsc",
    example: "HDFC0009046",
  })
  @IsNotEmpty()
  @IsString()
  ifsc: string;

  @ApiProperty({
    description: "Bank acc number",
    example: "589801562378",
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;
}
