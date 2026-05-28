// Core exports
export * from "./api-client.module";
export * from "./api-client.provider";
export * from "./clients/base-service-client";
export * from "./clients/internal/config";
export * from "./types";

// Internal service clients - Current Microservices
export * from "./clients/internal/cms.client";
export * from "./clients/internal/identity.client";
export * from "./clients/internal/payment.client";
export * from "./clients/internal/portfolio.client";
export * from "./clients/internal/transaction.client";

// Internal service clients - Legacy Services
// export * from "./clients/internal/compliance.client";
// export * from "./clients/internal/diffusion.client";
// export * from "./clients/internal/document.client";
// export * from "./clients/internal/livelihood.client";
// export * from "./clients/internal/notification.client";
// export * from "./clients/internal/trace.client";

// External service clients
export * from "./clients/external/firebase.client";
export * from "./clients/external/mapbox.client";
export * from "./clients/external/sms.client";

// Main service client provider (most common usage)
export { ApiClientProvider } from "./api-client.provider";
