import { Injectable } from "@nestjs/common";
import { SmsClient } from "./clients/external/sms.client";
import { CmsServiceClient } from "./clients/internal/cms.client";
import { IdentityServiceClient } from "./clients/internal/identity.client";
import { NotificationServiceClient } from "./clients/internal/notification.client";
import { PaymentServiceClient } from "./clients/internal/payment.client";
import { PortfolioServiceClient } from "./clients/internal/portfolio.client";
import { TransactionServiceClient } from "./clients/internal/transaction.client";
import type { ApiClientOptions, ServiceResponse } from "./types";

@Injectable()
export class ApiClientProvider {
  // Current Microservices
  private identityClient: IdentityServiceClient;
  private cmsClient: CmsServiceClient;
  private portfolioClient: PortfolioServiceClient;
  private paymentClient: PaymentServiceClient;
  private transactionClient: TransactionServiceClient;

  // Legacy Services (for backward compatibility)
  private notificationClient: NotificationServiceClient;

  // External Services
  private smsClient: SmsClient;

  constructor(private readonly options: ApiClientOptions = {}) {
    // Initialize current microservice clients
    this.identityClient = new IdentityServiceClient(this.options);
    this.cmsClient = new CmsServiceClient(this.options);
    this.portfolioClient = new PortfolioServiceClient(this.options);
    this.paymentClient = new PaymentServiceClient(this.options);
    this.transactionClient = new TransactionServiceClient(this.options);

    // Initialize legacy service clients
    this.notificationClient = new NotificationServiceClient(this.options);

    // Initialize external clients
    this.smsClient = new SmsClient();
  }

  /**
   * Get identity service client
   * Usage: this.serviceClient.identity.getUserInfo({ ... })
   */
  get identity(): IdentityServiceClient {
    return this.identityClient;
  }

  /**
   * Get CMS service client
   * Usage: this.serviceClient.cms.createTraining({ ... })
   */
  get cms(): CmsServiceClient {
    return this.cmsClient;
  }

  /**
   * Get portfolio service client
   * Usage: this.serviceClient.portfolio.createPortfolio({ ... })
   */
  get portfolio(): PortfolioServiceClient {
    return this.portfolioClient;
  }

  /**
   * Get payment service client
   * Usage: this.serviceClient.payment.createPayment({ ... })
   */
  get payment(): PaymentServiceClient {
    return this.paymentClient;
  }

  /**
   * Get transaction service client
   * Usage: this.serviceClient.transaction.createTransaction({ ... })
   */
  get transaction(): TransactionServiceClient {
    return this.transactionClient;
  }

  /**
   * Get notification service client (legacy)
   * Usage: this.serviceClient.notification.sendSms({ ... })
   */
  get notification(): NotificationServiceClient {
    return this.notificationClient;
  }

  /**
   * Get SMS client for external SMS API calls
   * Usage: this.serviceClient.sms.sendGetRequest(url) or this.serviceClient.sms.sendPostRequest(url, payload, username, password)
   */
  get sms(): SmsClient {
    return this.smsClient;
  }

  /**
   * Direct call method for any service
   * Usage: this.serviceClient.call('notification-service', 'sms.send', data)
   */
  async call<T = any>(
    serviceName: string,
    method: string,
    data?: any,
  ): Promise<ServiceResponse<T>> {
    // Use the first available client to make the call
    return this.notificationClient.call<T>(serviceName, method, data);
  }
}
