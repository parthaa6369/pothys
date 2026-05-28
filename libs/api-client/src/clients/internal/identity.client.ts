import { Injectable } from "@nestjs/common";
import { ServiceResponse } from "../../types";
import { BaseServiceClient } from "../base-service-client";

declare enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
declare enum EventCategory {
  DIFFUSION = "diffusion",
  TRACEABILITY_VERIFICATION = "traceability_and_verification",
  CERTIFICATION_COMPLIANCE = "certification_and_compliance",
  LIVELIHOOD_IMPROVEMENT = "livelihood_improvement",
}

// User participant Service Types
export interface CreateParticipantUserRequest {
  name: string;
  mobile: string;
  icNumber: string;
  profilePic?: string;
  gender?: Gender;
}
export interface UpdateParticipantUser {
  pillar: EventCategory;
  updatedBy: string;
  userId: string;
}

export interface GetUsersByIdsRequest {
  userIds: string[];
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  profilePic?: string;
  icNumber: string;
  gender?: Gender;
  roles?: string;
}

@Injectable()
export class IdentityServiceClient extends BaseServiceClient {
  /**
   * Create a new participant
   * @param participantData - Participant creation data
   * @returns Promise<ServiceResponse<any>>
   */
  async createParticipantUser(
    participantData: CreateParticipantUserRequest,
  ): Promise<ServiceResponse<any>> {
    return this.call<any>(
      "identity-service",
      "users/participant",
      participantData,
    );
  }

  /**
   * Create a new participant
   * @param participantData - Participant creation data
   * @returns Promise<ServiceResponse<any>>
   */
  async updateParticipantUser(
    participantData: UpdateParticipantUser,
  ): Promise<ServiceResponse<any>> {
    return this.call<any>(
      "identity-service",
      "users/updateParticipantUser",
      participantData,
      undefined,
      "PATCH",
    );
  }

  /**
   * Get multiple users by their IDs
   * @param userIds - Array of user IDs to fetch
   * @returns Promise<ServiceResponse<UserResponse[]>>
   */
  async getUsersByIds(
    userIds: string[],
  ): Promise<ServiceResponse<UserResponse[]>> {
    const requestData: GetUsersByIdsRequest = { userIds };
    return this.call<UserResponse[]>(
      "identity-service",
      "users/batch-get-by-ids",
      requestData,
    );
  }

  async fetchActiveOrganisations(): Promise<ServiceResponse<any[]>> {
    return this.call<any[]>(
      "identity-service",
      "onboarding/fetchActiveOrganisations",
      undefined,
      undefined,
      "GET",
    );
  }

  async fetchCollectionAndOrganisations(body: {
    collectionCenterId?: string;
    organisation?: string;
  }): Promise<ServiceResponse<any>> {
    return this.call<any[]>(
      "identity-service",
      "onboarding/fetchCollectionAndOrganisations",
      body,
      undefined,
      "POST",
    );
  }

  /**
   * Get organisation statistics for a date range
   * @param params - Date range parameters
   * @returns Promise<ServiceResponse<{ totalCount: number; percentageDifference: number }>>
   */
  async getOrganisationStats(params: {
    startOfCurrentMonth: Date;
    endOfCurrentMonth: Date;
    startOfLastMonth: Date;
    endOfLastMonth: Date;
  }): Promise<
    ServiceResponse<{ totalCount: number; percentageDifference: number }>
  > {
    return this.call<{ totalCount: number; percentageDifference: number }>(
      "identity-service",
      "onboarding/organisation-stats",
      params,
      undefined,
      "GET",
    );
  }
}
