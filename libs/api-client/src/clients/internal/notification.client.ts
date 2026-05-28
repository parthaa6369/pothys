import { Injectable } from "@nestjs/common";
import { ServiceResponse } from "../../types";
import { BaseServiceClient } from "../base-service-client";

// SMS Service Types
export interface SendSmsRequest {
  phoneNumber: string;
  message: string;
  senderId?: string;
  metadata?: Record<string, any>;
}

export interface SendSmsResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
}

@Injectable()
export class NotificationServiceClient extends BaseServiceClient {
  /**
   * Send OTP SMS (Internal Service Communication - direct endpoint call)
   * Usage: await notificationClient.sendOtpSms({ phoneNumber: '+1234567890', otp: '123456' })
   */
  async sendOtpSms(request: {
    phoneNumber: string;
    otp: string;
    senderId?: string;
    metadata?: Record<string, any>;
  }): Promise<ServiceResponse<SendSmsResponse>> {
    return this.call<SendSmsResponse>(
      "notification-service",
      "sms/internal/send-otp",
      request,
    );
  }

  /**
   * Send email notification (direct endpoint call)
   * Usage: await notificationClient.sendEmail({ to: 'user@example.com', subject: 'Hello', body: 'Message' })
   */
  async sendEmail(request: {
    toEmail: string;
    emailType: string;
    variables: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      platformName?: string;
      actionRequired?: boolean;
      [key: string]: any;
    };
    fromService: string;
  }): Promise<ServiceResponse<any>> {
    return this.call("notification-service", "email/send", request);
  }

  /**
   * Send push notification (direct endpoint call)
   * Usage: await notificationClient.sendPushNotification({ userId: '123', title: 'Hello', body: 'Message' })
   */
  async sendPushNotification(request: {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<ServiceResponse<any>> {
    return this.call("notification-service", "push/send", request);
  }
}
