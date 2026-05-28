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
import { KycService } from "./kyc.service";
import { JwtAuthGuard, Public } from "@pothys/auth";
import { MessageContent } from "@pothys/core/dist/messages/common";
import { AddBankDto } from "./dto/create-bank.dto";
import { CreateKycDto } from "./dto/create-kyc.dto";

@ApiBearerAuth()
@ApiTags("kyc")
@Controller("kyc")
@UseGuards(JwtAuthGuard)
export class KycController {
  private readonly logger = new Logger(KycController.name);
  constructor(private readonly kycService: KycService) {}

  // add nominee
  @ApiOperation({ summary: "Add nominee" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        nominee_type: { type: "string", example: "father" },
        nominee_name: { type: "string", example: "john" },
      },
      required: ["nominee_type", "nominee_name"],
    },
  })
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
        message: [MessageContent.OPERATION_FAILED("Nominee create")],
        success: false,
        data: "",
      },
    },
  })
  @Post("/nominee")
  async addAddress(
    @Body("nominee_type") nominee_type: string,
    @Body("nominee_name") nominee_name: string,
    @Req() req,
  ) {
    try {
      this.logger.log(`Add Address Api`);
      const response = await this.kycService.addNominee(
        nominee_type,
        nominee_name,
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

  //get nominee
  @ApiOperation({ summary: "Get nominee" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.FETCHED("Nominee")],
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
  @Get("/nominee")
  async getAddress(@Req() req) {
    try {
      this.logger.log(`Get address Api`);
      const response = await this.kycService.getNominee(req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //edit nominee
  @ApiOperation({ summary: "Edit nominee" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        nominee_type: { type: "string", example: "father" },
        nominee_name: { type: "string", example: "john" },
      },
      required: ["nominee_type", "nominee_name"],
    },
  })
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
        message: [MessageContent.NOT_FOUND_MESSAGE("Nominee")],
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
          MessageContent.OPERATION_FAILED("Edit nominee"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "nominee_id",
    description: "nominee_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Put("/nominee/:nominee_id")
  async editAddress(
    @Param("nominee_id") nominee_id: string,
    @Req() req,
    @Body("nominee_type") nominee_type: string,
    @Body("nominee_name") nominee_name: string,
  ) {
    try {
      this.logger.log(`Edit address Api`);
      const response = await this.kycService.editNominee(
        nominee_id,
        nominee_type,
        nominee_name,
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
  @ApiOperation({ summary: "Delete nominee" })
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
        message: [MessageContent.NOT_FOUND_MESSAGE("Nominee")],
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
          MessageContent.OPERATION_FAILED("Remove nominee"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "nominee_id",
    description: "nominee_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Delete("/nominee/:nominee_id")
  async deleteAddress(@Param("nominee_id") nominee_id: string, @Req() req) {
    try {
      this.logger.log(`Delete address Api`);
      const response = await this.kycService.deleteNominee(
        nominee_id,
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

  // add bank
  @ApiOperation({ summary: "Add nominee" })
  @ApiBody({ type: AddBankDto })
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
        message: [MessageContent.OPERATION_FAILED("Bank details create")],
        success: false,
        data: "",
      },
    },
  })
  @Post("/bank")
  async addBank(@Body() AddBankDto: AddBankDto, @Req() req) {
    try {
      this.logger.log(`Add Bank details Api`);
      const response = await this.kycService.addBank(AddBankDto, req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //get bank
  @ApiOperation({ summary: "Get bank details" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.FETCHED("Bank details")],
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
  @Get("/bank")
  async getBank(@Req() req) {
    try {
      this.logger.log(`Get bank details Api`);
      const response = await this.kycService.getBank(req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //edit bank
  @ApiOperation({ summary: "Edit bank details" })
  @ApiBody({ type: AddBankDto })
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
        message: [MessageContent.NOT_FOUND_MESSAGE("Bank details")],
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
          MessageContent.OPERATION_FAILED("Edit bank details"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "bank_details_id",
    description: "bank_details_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Put("/bank/:bank_details_id")
  async editBank(
    @Param("bank_details_id") bank_details_id: string,
    @Req() req,
    @Body() AddBankDto: AddBankDto,
  ) {
    try {
      this.logger.log(`Edit address Api`);
      const response = await this.kycService.editBank(
        bank_details_id,
        AddBankDto,
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

  // create kyc
  @ApiOperation({ summary: "Create kyc" })
  @ApiBody({ type: CreateKycDto })
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
        message: [MessageContent.OPERATION_FAILED("Kyc details create")],
        success: false,
        data: "",
      },
    },
  })
  @Post("/documents")
  async addKyc(@Body() CreateKycDto: CreateKycDto, @Req() req) {
    try {
      this.logger.log(`Add kyc details Api`);
      const response = await this.kycService.addKyc(CreateKycDto, req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //get kyc
  @ApiOperation({ summary: "Get kyc details" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.FETCHED("Kyc details")],
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
  @Get("/documents")
  async getKyc(@Req() req) {
    try {
      this.logger.log(`Get kyc details Api`);
      const response = await this.kycService.getKyc(req.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //edit kyc
  @ApiOperation({ summary: "Edit kyc details" })
  @ApiBody({ type: CreateKycDto })
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
        message: [MessageContent.NOT_FOUND_MESSAGE("Kyc details")],
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
          MessageContent.OPERATION_FAILED("Edit bank details"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiParam({
    name: "kyc_doc_id",
    description: "kyc_doc_id",
    required: true,
    example: "514c81aa-bf2d-410e-8a48-8cc849f72849",
  })
  @Put("/documents/:kyc_doc_id")
  async editKyc(
    @Param("kyc_doc_id") kyc_doc_id: string,
    @Req() req,
    @Body() CreateKycDto: CreateKycDto,
  ) {
    try {
      this.logger.log(`Edit address Api`);
      const response = await this.kycService.editKyc(
        kyc_doc_id,
        CreateKycDto,
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
