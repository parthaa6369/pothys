import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

@Injectable()
export class SmsClient {
  /**
   * Send HTTP GET request to SMS API
   * @param url - The complete URL with query parameters
   * @returns Promise<AxiosResponse> - Raw axios response
   */
  async sendGetRequest(url: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      timeout: 30000,
      headers: {
        "User-Agent": "ASB-SMS-Service/1.0",
      },
    };

    return axios.get(url, config);
  }

  /**
   * Send HTTP POST request to SMS API with Basic Auth
   * @param url - The API endpoint URL
   * @param payload - The request payload
   * @param username - Username for Basic Auth
   * @param password - Password for Basic Auth
   * @returns Promise<AxiosResponse> - Raw axios response
   */
  async sendPostRequest(
    url: string,
    payload: any,
    username: string,
    password: string,
  ): Promise<AxiosResponse> {
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "Content-Length": JSON.stringify(payload).length.toString(),
        "User-Agent": "ASB-SMS-Service/1.0",
      },
      timeout: 60000,
    };

    return axios.post(url, JSON.stringify(payload), config);
  }
}
