import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  Put,
  Query,
  UseGuards,
  Req,
  Logger,
  BadRequestException,
  Patch,
  Delete,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from "@pothys/swagger-base";
import { JwtAuthGuard, Public } from "@pothys/auth";
import { Request } from "express";
import { AddAddressDto } from "./dto/add-address.dto";
import { AddDeviceDto } from "./dto/add-device.dto";
import { MessageContent } from "@pothys/core/dist/messages/common";

@ApiBearerAuth()
@ApiTags("customers")
@Controller("customers")
@UseGuards(JwtAuthGuard)
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);
  constructor(private readonly customersService: CustomersService) {}

  //create customer
  @ApiOperation({ summary: "Create customer" })
  @ApiBody({ type: CreateCustomerDto })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.CREATED_SUCCESSFULLY],
        success: true,
        data: { accessToken: "", refreshToken: "" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [
          MessageContent.ALREADY_EXISTS_MESSAGE("Email"),
          MessageContent.ALREADY_EXISTS_MESSAGE("Mobile number"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [MessageContent.OPERATION_FAILED("Customer creation")],
        success: false,
        data: "",
      },
    },
  })
  @Public()
  @Post("/create")
  async createCustomer(@Body() CreateDocumentDto: CreateCustomerDto) {
    try {
      this.logger.log(`Create Customer Api`);
      const response =
        await this.customersService.createCustomer(CreateDocumentDto);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //get profile
  @ApiOperation({ summary: "Get profile" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.FETCHED("Profile")],
        success: true,
        data: [],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: ["Internal server Error | Error message"],
        success: false,
        data: "",
      },
    },
  })
  @Get("/customer")
  async getProfile(@Req() req) {
    try {
      this.logger.log(`Get customer Api`);
      const response = await this.customersService.getProfile(req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //edit profile
  @ApiOperation({ summary: "Edit profile" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.UPDATED_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.OPERATION_FAILED("Profile modification")],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: ["Internal server Error | Error message"],
        success: false,
        data: "",
      },
    },
  })
  @Put("/customer")
  async editProfile(@Req() req, @Body() UpdateCustomerDto: UpdateCustomerDto) {
    try {
      this.logger.log(`Edit profile Api`);
      const response = await this.customersService.editProfile(
        UpdateCustomerDto,
        req.user,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // add device
  @ApiOperation({ summary: "Add device" })
  @ApiBody({ type: AddDeviceDto })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.CREATED_SUCCESSFULLY],
        success: true,
        data: [],
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.ALREADY_EXISTS_MESSAGE("Device")],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [MessageContent.OPERATION_FAILED("Add device")],
        success: false,
        data: "",
      },
    },
  })
  @Post("/device")
  async addDevice(@Body() AddDeviceDto: AddDeviceDto, @Req() req) {
    try {
      this.logger.log(`Add Device Api`);
      const response = await this.customersService.addDevice(
        req.user,
        AddDeviceDto,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //set mpin
  @ApiOperation({ summary: "Set mpin" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.CREATED_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.NOT_FOUND_MESSAGE("Device")],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [
          "Internal server Error | Error message",
          MessageContent.OPERATION_FAILED("Set mpin"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        device_id: { type: "string", example: "AP3A.240905.015.A2" },
        mpin: { type: "string", example: "7788", minLength: 4, maxLength: 4 },
      },
      required: ["device_id", "mpin"],
    },
  })
  @Public()
  @Post("/mpin")
  async setMpin(
    @Body("device_id") device_id: string,
    @Body("mpin") mpin: string,
  ) {
    try {
      this.logger.log(`Set mpin Api`);
      const response = await this.customersService.setMpin(device_id, mpin);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //change mpin
  @ApiOperation({ summary: "Change mpin" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.DATA_UPDATED_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [
          MessageContent.NOT_FOUND_MESSAGE("Device"),
          MessageContent.OPERATION_FAILED("Mpin verification"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [
          "Internal server Error | Error message",
          MessageContent.OPERATION_FAILED("Change mpin"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        device_id: { type: "string", example: "AP3A.240905.015.A2" },
        old_mpin: {
          type: "string",
          example: "7788",
          minLength: 4,
          maxLength: 4,
        },
        new_mpin: {
          type: "string",
          example: "4466",
          minLength: 4,
          maxLength: 4,
        },
      },
      required: ["device_id", "old_mpin", "new_mpin"],
    },
  })
  @Put("/mpin")
  async changeMpin(
    @Body("device_id") device_id: string,
    @Body("old_mpin") old_mpin: string,
    @Body("new_mpin") new_mpin: string,
  ) {
    try {
      this.logger.log(`Change mpin Api`);
      const response = await this.customersService.changeMpin(
        device_id,
        old_mpin,
        new_mpin,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //get address
  @ApiOperation({ summary: "Get address" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.FETCHED("Address")],
        success: true,
        data: [],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: ["Internal server Error | Error message"],
        success: false,
        data: "",
      },
    },
  })
  @Get("/address")
  async getAddress(@Req() req) {
    try {
      this.logger.log(`Get address Api`);
      const response = await this.customersService.getAddress(req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // add address
  @ApiOperation({ summary: "Add address" })
  @ApiBody({ type: AddAddressDto })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.CREATED_SUCCESSFULLY],
        success: true,
        data: [],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [MessageContent.OPERATION_FAILED("Address create")],
        success: false,
        data: "",
      },
    },
  })
  @Post("/address")
  async addAddress(@Body() AddAddressDto: AddAddressDto, @Req() req) {
    try {
      this.logger.log(`Add Address Api`);
      const response = await this.customersService.addAddress(
        AddAddressDto,
        req.user,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //edit address
  @ApiOperation({ summary: "Edit address" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.UPDATED_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.NOT_FOUND_MESSAGE("Address")],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [
          "Internal server Error | Error message",
          MessageContent.OPERATION_FAILED("Edit address"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "address_id",
    description: "address_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Put("/address/:address_id")
  async editAddress(
    @Param("address_id") address_id: string,
    @Req() req,
    @Body() AddAddressDto: AddAddressDto,
  ) {
    try {
      this.logger.log(`Edit address Api`);
      const response = await this.customersService.editAddress(
        AddAddressDto,
        address_id,
        req.user,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //delete address
  @ApiOperation({ summary: "Delete address" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.DATA_DELETED_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.NOT_FOUND_MESSAGE("Address")],
        success: false,
        data: "",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error | Error message",
    schema: {
      example: {
        statusCode: 500,
        message: [
          "Internal server Error | Error message",
          MessageContent.OPERATION_FAILED("Remove address"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "address_id",
    description: "address_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Delete("/address/:address_id")
  async deleteAddress(@Param("address_id") address_id: string, @Req() req) {
    try {
      this.logger.log(`Delete address Api`);
      const response = await this.customersService.deleteAddress(
        address_id,
        req.user,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
