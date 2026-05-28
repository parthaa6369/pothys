import { ServiceConfig } from "../../types";

// Helper function to determine HTTP protocol based on environment
const getHttpProtocol = (): string => {
  const env = process.env.NODE_ENV || process.env.APP_ENV || "development";
  return env === "production" ? "http" : "http"; // TODO: Change to 'https' in production, when production server is setup
};

export const SERVICE_CONFIG: Record<string, ServiceConfig> = {
  "identity-service": {
    name: "identity-service",
    httpUrl: `${getHttpProtocol()}://${process.env.IDENTITY_SERVICE_HOST || "identity-service"}:${process.env.IDENTITY_SERVICE_PORT || "3000"}`,
  },
  "cms-service": {
    name: "cms-service",
    httpUrl: `${getHttpProtocol()}://${process.env.CMS_SERVICE_HOST || "cms-service"}:${process.env.CMS_SERVICE_PORT || "3001"}`,
  },
  "portfolio-service": {
    name: "portfolio-service",
    httpUrl: `${getHttpProtocol()}://${process.env.PORTFOLIO_SERVICE_HOST || "portfolio-service"}:${process.env.PORTFOLIO_SERVICE_PORT || "3002"}`,
  },
  "payment-service": {
    name: "payment-service",
    httpUrl: `${getHttpProtocol()}://${process.env.PAYMENT_SERVICE_HOST || "payment-service"}:${process.env.PAYMENT_SERVICE_PORT || "3003"}`,
  },
  "transaction-service": {
    name: "transaction-service",
    httpUrl: `${getHttpProtocol()}://${process.env.TRANSACTION_SERVICE_HOST || "transaction-service"}:${process.env.TRANSACTION_SERVICE_PORT || "3004"}`,
  },
  // Legacy services (keep for backward compatibility)
  "notification-service": {
    name: "notification-service",
    httpUrl: `${getHttpProtocol()}://${process.env.NOTIFICATION_SERVICE_HOST || "notification-service-dev"}:${process.env.NOTIFICATION_SERVICE_PORT || "3000"}`,
  },
  "diffusion-service": {
    name: "diffusion-service",
    httpUrl: `${getHttpProtocol()}://${process.env.DIFFUSION_SERVICE_HOST || "diffusion-service-dev"}:${process.env.DIFFUSION_SERVICE_PORT || "3000"}`,
  },
  "document-service": {
    name: "document-service",
    httpUrl: `${getHttpProtocol()}://${process.env.DOCUMENT_SERVICE_HOST || "document-service-dev"}:${process.env.DOCUMENT_SERVICE_PORT || "3000"}`,
  },
  "trace-service": {
    name: "trace-service",
    httpUrl: `${getHttpProtocol()}://${process.env.TRACE_SERVICE_HOST || "trace-service-dev"}:${process.env.TRACE_SERVICE_PORT || "3000"}`,
  },
};

export const DEFAULT_TIMEOUT = 5000;
export const DEFAULT_RETRIES = 3;
