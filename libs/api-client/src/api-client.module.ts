import { DynamicModule, Global, Module } from "@nestjs/common";
import { ApiClientProvider } from "./api-client.provider";
import { FirebaseClient } from "./clients/external/firebase.client";
import { MapboxClient } from "./clients/external/mapbox.client";
import { SmsClient } from "./clients/external/sms.client";
import { CmsServiceClient } from "./clients/internal/cms.client";
// import { ComplianceServiceClient } from "./clients/internal/compliance.client";
// import { DocumentServiceClient } from "./clients/internal/document.client";
// import { DiffusionServiceClient } from "./clients/internal/diffusion.client";
import { IdentityServiceClient } from "./clients/internal/identity.client";
// import { LivelihoodServiceClient } from "./clients/internal/livelihood.client";
import { NotificationServiceClient } from "./clients/internal/notification.client";
import { PaymentServiceClient } from "./clients/internal/payment.client";
import { PortfolioServiceClient } from "./clients/internal/portfolio.client";
// import { TraceServiceClient } from "./clients/internal/trace.client";
import { TransactionServiceClient } from "./clients/internal/transaction.client";
import { ApiClientOptions } from "./types";

@Global()
@Module({})
export class ApiClientModule {
  /**
   * Register the API client module with custom options
   * Usage in app.module.ts:
   *
   * @Module({
   *   imports: [
   *     ApiClientModule.register({
   *       timeout: 10000,
   *       retries: 3
   *     })
   *   ]
   * })
   */
  static register(options: ApiClientOptions = {}): DynamicModule {
    return {
      module: ApiClientModule,
      providers: [
        {
          provide: "API_CLIENT_OPTIONS",
          useValue: options,
        },
        {
          provide: ApiClientProvider,
          useFactory: (opts: ApiClientOptions) => new ApiClientProvider(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // Internal Service Clients - Current Microservices
        {
          provide: IdentityServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new IdentityServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: CmsServiceClient,
          useFactory: (opts: ApiClientOptions) => new CmsServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: PortfolioServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new PortfolioServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: PaymentServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new PaymentServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: TransactionServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new TransactionServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // Legacy Service Clients (for backward compatibility)
        {
          provide: NotificationServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new NotificationServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // {
        //   provide: DiffusionServiceClient,
        //   useFactory: (opts: ApiClientOptions) =>
        //     new DiffusionServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: TraceServiceClient,
        //   useFactory: (opts: ApiClientOptions) => new TraceServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: DocumentServiceClient,
        //   useFactory: (opts: ApiClientOptions) =>
        //     new DocumentServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: ComplianceServiceClient,
        //   useClass: ComplianceServiceClient,
        // },
        // {
        //   provide: LivelihoodServiceClient,
        //   useClass: LivelihoodServiceClient,
        // },
        // External Service Clients
        {
          provide: MapboxClient,
          useClass: MapboxClient,
        },
        {
          provide: FirebaseClient,
          useClass: FirebaseClient,
        },
        {
          provide: SmsClient,
          useClass: SmsClient,
        },
      ],
      exports: [
        ApiClientProvider,
        // Current Microservices
        IdentityServiceClient,
        CmsServiceClient,
        PortfolioServiceClient,
        PaymentServiceClient,
        TransactionServiceClient,
        // External Clients
        MapboxClient,
        FirebaseClient,
        SmsClient,
        // Legacy Services (for backward compatibility)
        NotificationServiceClient,
        // DiffusionServiceClient,
        // TraceServiceClient,
        // ComplianceServiceClient,
        // DocumentServiceClient,
        // LivelihoodServiceClient,
      ],
    };
  }

  /**
   * Register as async module with factory
   * Usage:
   *
   * ApiClientModule.registerAsync({
   *   useFactory: (configService: ConfigService) => ({
   *     timeout: configService.get('API_CLIENT_TIMEOUT', 5000),
   *     fallbackToHttp: configService.get('API_CLIENT_FALLBACK', true),
   *   }),
   *   inject: [ConfigService],
   * })
   */
  static registerAsync(options: {
    useFactory: (
      ...args: any[]
    ) => ApiClientOptions | Promise<ApiClientOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ApiClientModule,
      providers: [
        {
          provide: "API_CLIENT_OPTIONS",
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: ApiClientProvider,
          useFactory: (opts: ApiClientOptions) => new ApiClientProvider(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // Internal Service Clients - Current Microservices
        {
          provide: IdentityServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new IdentityServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: CmsServiceClient,
          useFactory: (opts: ApiClientOptions) => new CmsServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: PortfolioServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new PortfolioServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: PaymentServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new PaymentServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        {
          provide: TransactionServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new TransactionServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // Legacy Service Clients (for backward compatibility)
        {
          provide: NotificationServiceClient,
          useFactory: (opts: ApiClientOptions) =>
            new NotificationServiceClient(opts),
          inject: ["API_CLIENT_OPTIONS"],
        },
        // {
        //   provide: DiffusionServiceClient,
        //   useFactory: (opts: ApiClientOptions) =>
        //     new DiffusionServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: TraceServiceClient,
        //   useFactory: (opts: ApiClientOptions) => new TraceServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: DocumentServiceClient,
        //   useFactory: (opts: ApiClientOptions) =>
        //     new DocumentServiceClient(opts),
        //   inject: ["API_CLIENT_OPTIONS"],
        // },
        // {
        //   provide: ComplianceServiceClient,
        //   useClass: ComplianceServiceClient,
        // },
        // {
        //   provide: LivelihoodServiceClient,
        //   useClass: LivelihoodServiceClient,
        // },
      ],
      exports: [
        ApiClientProvider,
        // Current Microservices
        IdentityServiceClient,
        CmsServiceClient,
        PortfolioServiceClient,
        PaymentServiceClient,
        TransactionServiceClient,
        // Legacy Services (for backward compatibility)
        NotificationServiceClient,
        // DiffusionServiceClient,
        // TraceServiceClient,
        // ComplianceServiceClient,
        // DocumentServiceClient,
        // LivelihoodServiceClient,
      ],
    };
  }
}
