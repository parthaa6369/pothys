import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ResponseMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    // Store original json method
    const originalJson = res.json;

    // Override res.json to ensure consistent response structure
    res.json = function (body: any) {
      // If response is already structured with our format, don't wrap it
      if (body && typeof body === "object" && "success" in body) {
        return originalJson.call(this, body);
      }

      // Wrap response in our standard format
      const structuredResponse = {
        success: true,
        message: null,
        submessage: null,
        data: body,
      };

      return originalJson.call(this, structuredResponse);
    };

    next();
  }
}

// Function-based middleware for simpler usage
export function responseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (body && typeof body === "object" && "success" in body) {
      return originalJson.call(this, body);
    }

    const structuredResponse = {
      success: true,
      message: null,
      submessage: null,
      data: body,
    };

    return originalJson.call(this, structuredResponse);
  };

  next();
}
