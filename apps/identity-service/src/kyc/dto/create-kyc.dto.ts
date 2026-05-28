import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";

export class CreateKycDto {
  @ApiProperty({
    description: "pan",
    example: "EFQPA2136P",
  })
  @IsNotEmpty()
  @IsString()
  pan: string;

  @ApiProperty({
    description: "Pan verification status",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_pan_verified: boolean;

  @ApiPropertyOptional({
    description: "aadhar",
    example: "123412341234",
  })
  @IsOptional()
  @IsString()
  aadhar: string;

  @ApiPropertyOptional({
    description: "Adhar verification status",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_aadhar_verified: boolean;
}
