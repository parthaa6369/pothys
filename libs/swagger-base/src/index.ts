// Export commonly used Swagger decorators for API documentation
export {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiHideProperty,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
  PartialType,
} from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";

export interface SwaggerBaseOptions {
  title?: string;
  description?: string;
  version?: string;
  path?: string;
  customOptions?: SwaggerCustomOptions;
}

export function setupSwagger(
  app: INestApplication,
  options: SwaggerBaseOptions = {},
) {
  const {
    title = "API Documentation",
    description = "API documentation",
    version = "1.0",
    path = "api/docs",
    customOptions = {},
  } = options;

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, customOptions);
}

export * from "class-validator";
export * from "class-transformer";
