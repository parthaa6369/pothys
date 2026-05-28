# @asb/core

Core utilities and middleware for ASB backend services.

## Features

- Structured API responses
- Global exception handling
- Response middleware and interceptors
- Message content constants
- HTTP status codes

## Usage

### API Response Functions

```typescript
import { apiResponse, successResponse, errorResponse } from "@asb/core";

// In your controller or service
return successResponse(res, userData, "User created successfully", 201);
return errorResponse(res, "User not found", 404);
return apiResponse(res, 200, data, "Custom message", true);
```

### Message Content

```typescript
import { MessageContent } from "@asb/core";

// Use predefined messages
MessageContent.USER_CREATED_SUCCESSFULLY;
MessageContent.INVALID_CREDENTIALS;

// Use dynamic messages
MessageContent.USER_ALREADY_EXIST("email");
MessageContent.CREATED_UPDATED_EDITED("User", "Created");
```

### Global Exception Filter

```typescript
import { GlobalExceptionFilter } from "@asb/core";

// In your main.ts
app.useGlobalFilters(new GlobalExceptionFilter());
```

### Response Middleware

```typescript
import { ResponseMiddleware, responseMiddleware } from '@asb/core';

// Class-based (for module)
// In your module
@Module({
  providers: [ResponseMiddleware],
})

// Function-based (for app)
// In your main.ts
app.use(responseMiddleware);
```

### Response Interceptor

```typescript
import { ResponseInterceptor } from "@asb/core";

// In your main.ts
app.useGlobalInterceptors(new ResponseInterceptor());
```

## Response Structure

All responses follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "submessage": null,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "submessage": "Additional details",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "method": "POST"
}
```

# Test comment
