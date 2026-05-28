import { startApplication } from "@pothys/core";
import { setupSwagger } from "@pothys/swagger-base";
import { AppModule } from "./app.module";

/**
 * Traceabilty and verification Microservice Bootstrap
 *
 * Uses the @pothys/core bootstrap function which provides:
 * - Express body parsing (replaces body-parser)
 * - CORS configuration
 * - Global validation pipes
 * - Response middleware for consistent API responses
 * - Global exception filter for error handling
 * - Helmet security middleware
 * - Clustering support for better performance
 * - Swagger documentation setup
 */

// Bootstrap the Traceabilty and verification microservice using the core bootstrap function
startApplication({
  appModule: AppModule,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  globalPrefix: "api",
  corsOrigin: "*", // In production, specify exact domains

  // Body parser configuration
  jsonLimit: "50mb",
  urlencodedLimit: "50mb",
  parameterLimit: 50000,

  // Validation options (uses sensible defaults)
  validation: {
    transform: true,
    forbidUnknownValues: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  },

  // Clustering configuration
  clustering: {
    enabled: true,
    workers: process.env.NODE_ENV === "production" ? undefined : 2, // undefined = use all CPUs
  },

  // Security configuration
  security: {
    helmet: "api", // Use API-optimized helmet (good for REST APIs with Swagger)
  },

  // Swagger documentation
  swagger: {
    enabled: true,
    setupFunction: (app) =>
      setupSwagger(app, {
        description:
          "API documentation for the Traceabilty and verifications microservice",
        version: "1.0",
        path: "api-docs",
      }),
  },

  // Environment
  environment: process.env.NODE_ENV || "development",
}).catch((error) => {
  console.error(
    "❌ Failed to start Traceabilty and verification service:",
    error,
  );
  process.exit(1);
});
