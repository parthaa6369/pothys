import { Injectable } from "@nestjs/common";
import { BaseServiceClient } from "../base-service-client";
import type { ApiClientOptions, ServiceResponse } from "../../types";

@Injectable()
export class CmsServiceClient extends BaseServiceClient {
  constructor(options?: ApiClientOptions) {
    super(options);
  }

  // Training endpoints
  async createTraining(data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", "training", data, undefined, "POST");
  }

  async getTraining(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `training/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updateTraining(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", `training/${id}`, data, undefined, "PUT");
  }

  async deleteTraining(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `training/${id}`,
      undefined,
      undefined,
      "DELETE",
    );
  }

  // Lessons endpoints
  async createLesson(data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", "lessons", data, undefined, "POST");
  }

  async getLesson(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `lessons/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updateLesson(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", `lessons/${id}`, data, undefined, "PUT");
  }

  async deleteLesson(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `lessons/${id}`,
      undefined,
      undefined,
      "DELETE",
    );
  }

  // Events endpoints
  async createEvent(data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", "events", data, undefined, "POST");
  }

  async getEvent(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `events/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updateEvent(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", `events/${id}`, data, undefined, "PUT");
  }

  // Farmers endpoints
  async getFarmer(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `farmers/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async getFarmers(query?: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", "farmers", query, undefined, "GET");
  }

  // Participants endpoints
  async getParticipant(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `participants/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async getParticipants(query?: any): Promise<ServiceResponse<any>> {
    return this.call("cms-service", "participants", query, undefined, "GET");
  }

  // Reports endpoints
  async generateReport(
    type: string,
    filters?: any,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      "reports/generate",
      { type, filters },
      undefined,
      "POST",
    );
  }

  async getReport(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "cms-service",
      `reports/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }
}
