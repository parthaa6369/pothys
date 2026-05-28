import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { MessageContent } from "../messages/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = MessageContent.INTERNAL_SERVER_ERROR;
    let submessage: string | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const response = exceptionResponse as any;
        message = response.message || response.error || message;
        submessage = response.submessage || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message || MessageContent.INTERNAL_SERVER_ERROR;
    }

    // Handle specific status codes
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        message = MessageContent.UNAUTHORIZED;
        break;
      case HttpStatus.FORBIDDEN:
        message = MessageContent.FORBIDDEN;
        break;
      case HttpStatus.NOT_FOUND:
        message = MessageContent.NOT_FOUND;
        break;
      case HttpStatus.CONFLICT:
        message = MessageContent.CONFLICT;
        break;
      default:
        if (status === 440) {
          message = MessageContent.SESSION_EXPIRED;
        }
        break;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : "No stack trace available",
    );

    // Send structured error response
    response.status(status).json({
      success: false,
      message,
      submessage,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
