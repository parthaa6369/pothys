import { Injectable } from "@nestjs/common";
import { BaseServiceClient } from "../base-service-client";
import type { ApiClientOptions, ServiceResponse } from "../../types";

@Injectable()
export class PaymentServiceClient extends BaseServiceClient {
  constructor(options?: ApiClientOptions) {
    super(options);
  }

  // Payment endpoints
  async createPayment(data: any): Promise<ServiceResponse<any>> {
    return this.call("payment-service", "payment", data, undefined, "POST");
  }

  async getPayment(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `payment/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updatePayment(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `payment/${id}`,
      data,
      undefined,
      "PUT",
    );
  }

  async getPayments(query?: any): Promise<ServiceResponse<any>> {
    return this.call("payment-service", "payment", query, undefined, "GET");
  }

  // File management endpoints
  async uploadFile(data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      "filemanagement/upload",
      data,
      undefined,
      "POST",
    );
  }

  async getFile(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `filemanagement/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async deleteFile(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `filemanagement/${id}`,
      undefined,
      undefined,
      "DELETE",
    );
  }

  // Payment validation endpoints
  async validatePayment(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `payment/${id}/validate`,
      undefined,
      undefined,
      "POST",
    );
  }

  async processPayment(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "payment-service",
      `payment/${id}/process`,
      data,
      undefined,
      "POST",
    );
  }
}
