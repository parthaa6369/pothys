import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  submessage?: string | null;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already structured with our format, return as is
        if (data && typeof data === "object" && "success" in data) {
          return data;
        }

        // Structure the response
        return {
          success: true,
          message: null,
          submessage: null,
          data: data,
        };
      }),
    );
  }
}
