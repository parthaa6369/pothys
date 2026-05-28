import { Injectable } from "@nestjs/common";
import { BaseServiceClient } from "../base-service-client";
import type { ApiClientOptions, ServiceResponse } from "../../types";

@Injectable()
export class PortfolioServiceClient extends BaseServiceClient {
  constructor(options?: ApiClientOptions) {
    super(options);
  }

  // Portfolio endpoints
  async createPortfolio(data: any): Promise<ServiceResponse<any>> {
    return this.call("portfolio-service", "portfolio", data, undefined, "POST");
  }

  async getPortfolio(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `portfolio/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updatePortfolio(id: string, data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `portfolio/${id}`,
      data,
      undefined,
      "PUT",
    );
  }

  async deletePortfolio(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `portfolio/${id}`,
      undefined,
      undefined,
      "DELETE",
    );
  }

  // Farmer Journey endpoints
  async getFarmerJourney(farmerId: string): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `farmer-journey/${farmerId}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async updateFarmerJourney(
    farmerId: string,
    data: any,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `farmer-journey/${farmerId}`,
      data,
      undefined,
      "PUT",
    );
  }

  // Participant endpoints
  async getParticipant(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `participant/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }

  async getParticipants(query?: any): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      "participant",
      query,
      undefined,
      "GET",
    );
  }

  async createParticipant(data: any): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      "participant",
      data,
      undefined,
      "POST",
    );
  }

  async updateParticipant(
    id: string,
    data: any,
  ): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `participant/${id}`,
      data,
      undefined,
      "PUT",
    );
  }

  // Events endpoints
  async getEvents(query?: any): Promise<ServiceResponse<any>> {
    return this.call("portfolio-service", "events", query, undefined, "GET");
  }

  async getEvent(id: string): Promise<ServiceResponse<any>> {
    return this.call(
      "portfolio-service",
      `events/${id}`,
      undefined,
      undefined,
      "GET",
    );
  }
}
