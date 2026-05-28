import { Injectable } from "@nestjs/common";
import { BaseServiceClient } from "../base-service-client";
import type { ApiClientOptions, ServiceResponse } from "../../types";

@Injectable()
export class TransactionServiceClient extends BaseServiceClient {
  constructor(options?: ApiClientOptions) {
    super(options);
  }

  // Transaction endpoints
  async createTransaction(data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      "transaction",
      data,
      undefined,
      "POST",
    );
  }

  async getTransaction(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updateTransaction(
    id: string,
    data: any,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/${id}`,
      data,
      undefined,
      "PUT",
    );
  }

  async getTransactions(query?: any): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      "transaction",
      query,
      undefined,
      "GET",
    );
  }

  async deleteTransaction(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/${id}`,
      undefined,
      undefined,
      "DELETE",
    );
  }

  // Transaction validation endpoints
  async validateTransaction(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/${id}/validate`,
      undefined,
      undefined,
      "POST",
    );
  }

  async processTransaction(
    id: string,
    data: any,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/${id}/process`,
      data,
      undefined,
      "POST",
    );
  }

  // Batch transaction endpoints
  async createBatchTransaction(data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      "transaction/batch",
      data,
      undefined,
      "POST",
    );
  }

  async getBatchTransactionStatus(
    batchId: string,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "transaction-service",
      `transaction/batch/${batchId}/status`,
      undefined,
      undefined,
      "GET",
    );
  }
}
