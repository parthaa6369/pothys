import logger from "@pothys/logger";
import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiClientOptions } from "../types";
import { ServiceResponse } from "../types";
import { DEFAULT_TIMEOUT, SERVICE_CONFIG } from "./internal/config";

@Injectable()
export class BaseServiceClient {
  private readonly logger = new Logger(BaseServiceClient.name);
  constructor(private readonly options: ApiClientOptions = {}) {}

  /**
   * Internal service call (uses SERVICE_CONFIG and internal headers)
   */
  async call<T = any>(
    serviceName: string,
    endpoint: string,
    data?: any,
    customTimeout?: number,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "POST",
  ): Promise<ServiceResponse<T>> {
    const config = SERVICE_CONFIG[serviceName];
    if (!config) {
      throw new Error(`Service configuration not found for: ${serviceName}`);
    }

    const timeout = customTimeout || this.options.timeout || DEFAULT_TIMEOUT;
    const url = `${config.httpUrl}/api/${endpoint}`;

    try {
      const internalToken =
        process.env.INTERNAL_SERVICE_TOKEN || "default-internal-token";
      logger.debug(`Using x-internal-token: ${internalToken}`);
      const axiosConfig = {
        method,
        url,
        timeout,
        headers: {
          "Content-Type": "application/json",
          "x-internal-service": serviceName,
          "x-internal-token": internalToken,
        },
      } as any;
      if (method === "GET") {
        axiosConfig.params = data;
      } else {
        axiosConfig.data = data;
      }
      const response: AxiosResponse<ServiceResponse<T>> =
        await axios(axiosConfig);
      return response.data;
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || "HTTP call failed",
          statusCode: error.response.status,
        };
      }
      throw error;
    }
  }

  /**
   * External API call (flexible for any external service)
   */
  async callExternal<T = any>(
    url: string,
    options: AxiosRequestConfig = {},
    customTimeout?: number,
  ): Promise<ServiceResponse<T>> {
    const timeout = customTimeout || this.options.timeout || DEFAULT_TIMEOUT;

    try {
      const response: AxiosResponse<T> = await axios({
        url,
        method: options.method || "GET",
        data: options.data,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        timeout,
        ...options,
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      logger.error(`External API call failed to ${url}:`, error.message);

      if (error.response) {
        return {
          success: false,
          error:
            error.response.data?.message ||
            error.message ||
            "External API call failed",
          statusCode: error.response.status,
          data: error.response.data,
        };
      }

      return {
        success: false,
        error: error.message || "Network error",
        statusCode: 500,
      };
    }
  }

  /**
   * Helper method for GET requests to external APIs
   */
  async get<T = any>(
    url: string,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ServiceResponse<T>> {
    return this.callExternal<T>(url, { method: "GET", headers }, timeout);
  }

  /**
   * Helper method for POST requests to external APIs
   */
  async post<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ServiceResponse<T>> {
    return this.callExternal<T>(
      url,
      { method: "POST", data, headers },
      timeout,
    );
  }

  /**
   * Helper method for PUT requests to external APIs
   */
  async put<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ServiceResponse<T>> {
    return this.callExternal<T>(url, { method: "PUT", data, headers }, timeout);
  }

  /**
   * Helper method for DELETE requests to external APIs
   */
  async delete<T = any>(
    url: string,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ServiceResponse<T>> {
    return this.callExternal<T>(url, { method: "DELETE", headers }, timeout);
  }
}
