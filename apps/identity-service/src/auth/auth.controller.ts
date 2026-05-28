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
import { AuthService } from "./auth.service";
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
import { MessageContent } from "@pothys/core/dist/messages/common";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  //send otp
  @ApiOperation({ summary: "Send otp" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.OTP_SENT_SUCCESSFULLY],
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [MessageContent.NOT_FOUND_MESSAGE("Customer")],
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
          MessageContent.OPERATION_FAILED("Create otp"),
        ],
        success: false,
        data: "",
      },
    },
  })
  @ApiQuery({
    name: "mobile_number",
    description: "mobile_number",
    required: true,
  })
  @Public()
  @Get("/sendOtp/:mobile_number")
  async sendOtp(@Query("mobile_number") mobile_number: string) {
    try {
      this.logger.log(`Send otp Api`);
      const response = await this.authService.sendOtp(mobile_number);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //verify otp
  @ApiOperation({ summary: "Verify otp" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.OTP_VERIFIED_SUCCESSFULLY],
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
          MessageContent.NOT_FOUND_MESSAGE("Customer"),
          MessageContent.NOT_FOUND_MESSAGE("OTP"),
          MessageContent.OTP_ALREADY_VERIFIED,
          MessageContent.OTP_EXPIRED,
          MessageContent.INVALID_OTP,
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
        message: ["Internal server Error | Error message"],
        success: false,
        data: "",
      },
    },
  })
  @ApiQuery({
    name: "mobile_number",
    description: "mobile_number",
    required: true,
  })
  @ApiQuery({
    name: "otp",
    description: "otp",
    required: true,
    example: "5566",
  })
  @Public()
  @Get("/verifyOtp/:mobile_number")
  async verifyOtp(
    @Query("mobile_number") mobile_number: string,
    @Query("otp") otp: string,
  ) {
    try {
      this.logger.log(`Verify otp Api`);
      const response = await this.authService.verifyOtp(mobile_number, otp);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //mpin login
  @ApiOperation({ summary: "mpin login" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.LOGIN_SUCCESSFUL],
        success: true,
        data: {
          accessToken: "",
          refreshToken: "",
        },
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
          MessageContent.OPERATION_FAILED("Login mpin"),
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
        mpin: {
          type: "string",
          example: "7788",
          minLength: 4,
          maxLength: 4,
        },
      },
      required: ["device_id", "mpin"],
    },
  })
  @Public()
  @Post("/mpin/login")
  async mpinLogin(
    @Body("device_id") device_id: string,
    @Body("mpin") mpin: string,
  ) {
    try {
      this.logger.log(`Mpin login Api`);
      const response = await this.authService.mpinLogin(device_id, mpin);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //refresh token
  @ApiOperation({ summary: "Refresh token" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.SUCCESS],
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
        message: [MessageContent.NOT_FOUND_MESSAGE("Customer")],
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
          MessageContent.OPERATION_FAILED("Token not generated"),
          "Internal server Error | Error message",
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
        refresh_token: {
          type: "string",
          example:
            "eyeshikysdrjsndfsadf.tidfsdflsdrnadsfnasdfs.asdurasjdfasdfnadsfadn",
        },
      },
      required: ["refresh_token"],
    },
  })
  @Public()
  @Post("/refreshToken")
  async refreshToken(@Body("refresh_token") refresh_token: string) {
    try {
      this.logger.log(`refreshToken Api`);
      const response = await this.authService.refreshToken(refresh_token);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  //admin login
  @ApiOperation({ summary: "admin login" })
  @ApiOkResponse({
    description: "Success response",
    schema: {
      example: {
        statusCode: 200,
        message: [MessageContent.LOGIN_SUCCESSFUL],
        success: true,
        data: {
          accessToken: "",
          refreshToken: "",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
      example: {
        statusCode: 400,
        message: [
          MessageContent.NOT_FOUND_MESSAGE("Email"),
          MessageContent.OPERATION_FAILED("Password verification"),
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
          MessageContent.OPERATION_FAILED("Login"),
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
        email_id: { type: "string", example: "admin@gmail.com" },
        password: { type: "string", example: "Admin@123" },
      },
      required: ["email_id", "email_id"],
    },
  })
  @Public()
  @Post("/admin/login")
  async adminLogin(
    @Body("email_id") email_id: string,
    @Body("password") password: string,
  ) {
    try {
      this.logger.log(`Admin, login Api`);
      const response = await this.authService.adminLogin(email_id, password);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
