import { IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";

export class AddAddressDto {
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

  @ApiProperty({
    description: "Set as default address",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_default: boolean;
}
