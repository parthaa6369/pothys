# @asb/service-client

Unified service client library for TCP and HTTP notification-service between microservices.

## Features

- **Dual Transport Support**: Both TCP and HTTP notification-service
- **Automatic Fallback**: Falls back from TCP to HTTP automatically
- **Service Registry**: Centralized service configuration
- **Type Safety**: Full TypeScript support with proper interfaces
- **Built-in Logging**: Comprehensive logging for debugging
- **Health Checks**: Monitor service availability
- **Error Handling**: Graceful error handling and recovery

## Installation

```bash
# In the workspace root
pnpm add @asb/service-client -w

# Install peer dependencies
pnpm add @nestjs/microservices axios rxjs
```

## Quick Start

### 1. Import the Module

```typescript
import { Module } from "@nestjs/common";
import {
  ServiceClientModule,
  initializeDefaultServices,
} from "@asb/service-client";

@Module({
  imports: [ServiceClientModule],
})
export class AppModule {
  constructor() {
    // Initialize default service configurations
    initializeDefaultServices();
  }
}
```

### 2. Use the Unified Client

```typescript
import { Injectable } from "@nestjs/common";
import {
  UnifiedServiceClient,
  SendOtpRequest,
  OtpResponse,
  OtpType,
} from "@asb/service-client";

@Injectable()
export class AuthService {
  constructor(private readonly serviceClient: UnifiedServiceClient) {}

  async sendOtp(email: string): Promise<void> {
    const request: SendOtpRequest = {
      value: email,
      type: OtpType.EMAIL,
      email: email,
    };

    const result = await this.serviceClient.send<SendOtpRequest, OtpResponse>(
      "notification-service",
      "otp.generate",
      request,
      { preferredTransport: "TCP", fallbackEnabled: true },
    );

    if (!result.success) {
      throw new Error(result.message);
    }
  }
}
```

### 3. Use Specific Clients

```typescript
import { Injectable } from "@nestjs/common";
import {
  OtpServiceClient,
  SendOtpRequest,
  DEFAULT_SERVICES,
} from "@asb/service-client";

@Injectable()
export class OtpService {
  constructor(private readonly otpClient: OtpServiceClient) {}

  async generateOtp(request: SendOtpRequest) {
    // Use TCP
    return await this.otpClient.generateOtpTcp(
      DEFAULT_SERVICES.COMMUNICATION.TCP,
      request,
    );

    // Or use HTTP
    return await this.otpClient.generateOtpHttp(
      DEFAULT_SERVICES.COMMUNICATION.HTTP,
      request,
    );
  }
}
```

## Configuration

### Environment Variables

```env
# Communication Service
COMMUNICATION_SERVICE_HOST=localhost
COMMUNICATION_SERVICE_TCP_PORT=3001
COMMUNICATION_SERVICE_HTTP_PORT=2030
COMMUNICATION_SERVICE_URL=http://localhost:2030

# User Management Service
USER_MANAGEMENT_SERVICE_HOST=localhost
USER_MANAGEMENT_SERVICE_TCP_PORT=3002
USER_MANAGEMENT_SERVICE_HTTP_PORT=2031
USER_MANAGEMENT_SERVICE_URL=http://localhost:2031
```

### Custom Service Registration

```typescript
import { ServiceRegistry } from "@asb/service-client";

// Register custom service
ServiceRegistry.register("my-service-tcp", {
  transport: "TCP",
  host: "localhost",
  port: 3005,
});

ServiceRegistry.register("my-service-http", {
  transport: "HTTP",
  host: "localhost",
  port: 2035,
  baseURL: "http://localhost:2035",
  headers: {
    Authorization: "Bearer token",
  },
});
```

## Available Clients

### OtpServiceClient

- `generateOtpTcp()` / `generateOtpHttp()`
- `verifyOtpTcp()` / `verifyOtpHttp()`
- `resendOtpTcp()` / `resendOtpHttp()`

### UserServiceClient

- `createUserTcp()` / `createUserHttp()`
- `findUserByEmailTcp()` / `findUserByEmailHttp()`
- `loginUserTcp()` / `loginUserHttp()`

### UnifiedServiceClient

- `send()` - Auto-select transport with fallback
- `get()` - HTTP GET requests
- `post()` - HTTP POST requests
- `emit()` - TCP events (fire and forget)
- `healthCheck()` - Service health monitoring

## Transport Selection

### TCP (Recommended for Internal Services)

✅ **Pros:**

- Lower latency
- Better performance
- Type-safe message patterns
- Built-in load balancing

❌ **Cons:**

- Requires @nestjs/microservices
- More complex setup

### HTTP (Good for External APIs)

✅ **Pros:**

- Universal compatibility
- Easy debugging
- RESTful patterns
- Works with any HTTP client

❌ **Cons:**

- Higher overhead
- Less efficient for internal calls

## Error Handling

```typescript
const result = await serviceClient.send(
  "notification-service",
  "otp.generate",
  request,
);

if (!result.success) {
  console.error("Service call failed:", result.message);
  console.error("Error details:", result.error);
  console.error("Status code:", result.statusCode);
}
```

## Health Monitoring

```typescript
const health = await serviceClient.healthCheck("notification-service");

console.log("TCP Health:", health.tcp);
console.log("HTTP Health:", health.http);
console.log("Overall Health:", health.overall);
```

## Best Practices

1. **Use TCP for internal microservice notification-service**
2. **Use HTTP for external API calls**
3. **Enable fallback for critical operations**
4. **Monitor service health regularly**
5. **Use typed interfaces for all requests/responses**
6. **Configure appropriate timeouts**
7. **Log all service interactions**

## Migration Guide

### From Direct HTTP Calls

```typescript
// Before
const response = await axios.post("http://localhost:2030/otp/generate", data);

// After
const result = await serviceClient.post(
  "notification-service",
  "/otp/generate",
  data,
);
```

### From Custom TCP Clients

```typescript
// Before
const client = ClientProxyFactory.create({
  /* config */
});
const result = await client.send("otp.generate", data);

// After
const result = await serviceClient.send(
  "notification-service",
  "otp.generate",
  data,
);
```
