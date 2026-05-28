import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";

export class AddDeviceDto {
  @ApiProperty({
    description: "device_id of the customer phone",
    example: "RP1A.200720.011",
  })
  @IsNotEmpty()
  @IsString()
  device_id: string;

  @ApiPropertyOptional({
    description: "FCM token of the customer phone",
    example:
      "TeWLnETVURB2aS9XHpZR2pA:APA91bEJdVOVRb9x07X8KBsxHqRDGCMvBtdghjHoJ6OGJfZJWQvtoMaLr_aM-nrKjoaGCYSyeLdyEZBOFwJRDhxmyqpMuxGuAtPqAUMG7qO9d4e3LnfXuPw",
  })
  @IsOptional()
  @IsString()
  token: string;

  @ApiPropertyOptional({
    description: "Customer phone type",
    example: "android",
  })
  @IsOptional()
  @IsString()
  token_from: string;
}
