import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as os from "os";
const cluster = require("cluster");

import { GlobalExceptionFilter } from "../filters/global-exception.filter";
import {
  helmetApiMiddleware,
  helmetDevMiddleware,
  helmetMiddleware,
} from "../middleware/helmet.middleware";
import { responseMiddleware } from "../middleware/response.middleware";

export interface BootstrapOptions {
  // Application configuration
  appModule: any;
  port?: number;
  globalPrefix?: string;

  // CORS configuration
  corsOrigin?: string | string[];

  // Body parsing limits
  jsonLimit?: string;
  urlencodedLimit?: string;
  parameterLimit?: number;

  // Validation pipe options
  validation?: {
    transform?: boolean;
    forbidUnknownValues?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
  };

  // Clustering options
  clustering?: {
    enabled?: boolean;
    workers?: number;
  };

  // Swagger configuration
  swagger?: {
    enabled?: boolean;
    setupFunction?: (app: any) => void;
  };

  // Security configuration
  security?: {
    helmet?: boolean | "dev" | "api"; // true = full security, 'dev' = dev-friendly, 'api' = api-optimized
  };

  // Environment
  environment?: string;
}

const logger = new Logger("Bootstrap");

/**
 * Configures the NestJS application with common middleware, pipes, and filters
 */
export async function configureApp(
  app: any,
  options: BootstrapOptions,
): Promise<void> {
  // CORS - Allow cross-origin requests (fix for local dev)
  const corsOrigins = options.corsOrigin || [
    "http://a636c2c4b68b049eeb132063bbbb439c-66898748.ap-southeast-5.elb.amazonaws.com",
    "http://k8s-staging-asbfront-262db88bcf-dd85c8a06a683bcf.elb.ap-southeast-5.amazonaws.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "http://localhost:3007",
    "http://localhost:3008",
    "http://43.217.146.230:32080", // Identity
    "http://43.217.146.230:32081", // Analytics
    "http://43.217.146.230:32082", // Compliance
    "http://43.217.146.230:32083", // Document
    "http://43.217.146.230:32086", // Notification
    "http://43.217.146.230:32087", // Traceability
    "http://43.217.146.230:32088", // Diffusion
  ];

  // Convert to array if string
  const allowedOrigins = "*";

  app.enableCors({
    origin: (origin, callback) => {
      // If '*' is in allowed origins, allow all
      if (allowedOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      // Allow requests from allowed origins and Postman/curl (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Disposition"],
  });

  // Global API prefix
  if (options.globalPrefix) {
    app.setGlobalPrefix(options.globalPrefix);
  }

  // Configure Express body parsing limits (using NestJS platform-express)
  // NestJS already provides built-in body parsing, but we can customize limits
  if (options.jsonLimit || options.urlencodedLimit || options.parameterLimit) {
    // Use NestJS's built-in body parser configuration
    // This is the correct way to configure body parsing in NestJS v11+
    const jsonOptions: any = {};
    const urlencodedOptions: any = { extended: true };

    if (options.jsonLimit) {
      jsonOptions.limit = options.jsonLimit;
    }

    if (options.urlencodedLimit) {
      urlencodedOptions.limit = options.urlencodedLimit;
    }

    if (options.parameterLimit) {
      urlencodedOptions.parameterLimit = options.parameterLimit;
    }

    // Configure body parser using NestJS methods
    app.useBodyParser("json", jsonOptions);
    app.useBodyParser("urlencoded", urlencodedOptions);
  }

  // Global validation pipe
  const validationOptions = options.validation || {};
  app.useGlobalPipes(
    new ValidationPipe({
      transform: validationOptions.transform ?? true,
      forbidUnknownValues: validationOptions.forbidUnknownValues ?? true,
      whitelist: validationOptions.whitelist ?? true,
      forbidNonWhitelisted: validationOptions.forbidNonWhitelisted ?? true,
    }),
  );

  // Core package integrations
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(responseMiddleware);

  // Security middleware (helmet)
  const securityOptions = options.security || {};
  if (securityOptions.helmet !== false) {
    const helmetType = securityOptions.helmet || "api"; // Default to 'api' preset

    if (helmetType === "dev") {
      app.use(helmetDevMiddleware);
    } else if (helmetType === "api") {
      app.use(helmetApiMiddleware);
    } else if (helmetType === true) {
      app.use(helmetMiddleware); // Full security
    }
  }

  // Swagger documentation setup
  if (options.swagger?.enabled && options.swagger.setupFunction) {
    options.swagger.setupFunction(app);
  }
}

/**
 * Creates and configures a NestJS application
 */
export async function createApp(options: BootstrapOptions): Promise<any> {
  const app = await NestFactory.create(options.appModule);
  await configureApp(app, options);
  return app;
}

/**
 * Bootstrap function for single process applications
 */
export async function bootstrap(options: BootstrapOptions): Promise<void> {
  const app = await createApp(options);
  const port = options.port || process.env.PORT || 3000;

  await app.listen(port);

  const appUrl = await app.getUrl();
  logger.log(`🚀 Application is running on: ${appUrl}`);
}

/**
 * Bootstrap function with clustering support
 */
export async function bootstrapWithClustering(
  options: BootstrapOptions,
): Promise<void> {
  const clusteringOptions = options.clustering || {};

  if (!clusteringOptions.enabled) {
    return bootstrap(options);
  }

  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    const numWorkers =
      clusteringOptions.workers ||
      (options.environment === "production" ? numCPUs : 2);

    this.logger.log(`🚀 Master ${process.pid} is running`);
    this.logger.log(`🔄 Starting ${numWorkers} workers`);

    // Fork worker processes
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    // Handle worker crashes and restart them
    cluster.on("exit", (worker: any, code: any, signal: any) => {
      this.logger.warn(`👷 Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    // Worker process - run the actual application
    try {
      const app = await createApp(options);
      const port = options.port || process.env.PORT || 3000;

      await app.listen(port);

      const appUrl = await app.getUrl();
      this.logger.log(`🚀 Worker ${process.pid} running on: ${appUrl}`);
    } catch (error) {
      this.logger.error("❌ Error starting worker:", error);
      process.exit(1);
    }
  }
}

/**
 * Default bootstrap function - automatically determines if clustering should be used
 */
export async function startApplication(
  options: BootstrapOptions,
): Promise<void> {
  const shouldCluster =
    options.clustering?.enabled ??
    (options.environment === "production" ||
      process.env.NODE_ENV === "production");

  // if (shouldCluster) {
  //   return bootstrapWithClustering({
  //     ...options,
  //     clustering: { enabled: true, ...options.clustering }
  //   });
  // } else {
  return bootstrap(options);
  // }
}
