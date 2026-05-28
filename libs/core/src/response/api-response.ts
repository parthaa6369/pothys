import { Response } from "express";

export interface ApiResponseData {
  success: boolean;
  message?: string | null;
  submessage?: string | null;
  data?: any;
}

export function apiResponse(
  res: Response,
  statusCode: number,
  data: any = null,
  message: string | null = null,
  success: boolean = true,
  submessage: string | null = null,
): Response {
  return res.status(statusCode).json({
    success,
    message,
    submessage,
    data,
  });
}

export function successResponse(
  res: Response,
  data: any = null,
  message: string | null = "Success",
  statusCode: number = 200,
): Response {
  return apiResponse(res, statusCode, data, message, true);
}

export function invalidResponse(
  res: Response,
  message: string = "Bad request",
  statusCode: number = 400,
  submessage: string | null = null,
): Response {
  return apiResponse(res, statusCode, null, message, false, submessage);
}

export function createdResponse(
  res: Response,
  data: any = null,
  message: string = "Created successfully",
): Response {
  return apiResponse(res, 201, data, message, true);
}

export function notFoundResponse(
  res: Response,
  message: string = "Resource not found",
): Response {
  return apiResponse(res, 404, null, message, false);
}

export function serverErrorResponse(
  res: Response,
  message: string = "Internal server error",
): Response {
  return apiResponse(res, 500, null, message, false);
}
