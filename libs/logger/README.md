# @asb/logger

A comprehensive logging utility for the ASB backend monorepo.

## Features

- Configurable log levels (DEBUG, INFO, WARN, ERROR)
- Timestamp and level formatting
- Environment-aware default settings
- Child loggers with prefixes
- Pre-configured loggers for common use cases

## Usage

### Basic Usage

```typescript
import { Logger } from "@asb/logger";

Logger.info("Application started");
Logger.warn("This is a warning");
Logger.error("An error occurred");
Logger.debug("Debug information"); // Only shown in development
```

### Configuration

```typescript
import { Logger, LogLevel } from "@asb/logger";

Logger.configure({
  level: LogLevel.WARN, // Only show warnings and errors
  includeTimestamp: false,
  includeLevel: true,
  prefix: "MyApp",
});
```

### Pre-configured Loggers

```typescript
import { AppLogger, DbLogger, ApiLogger } from "@asb/logger";

AppLogger.info("Application event");
DbLogger.error("Database connection failed");
ApiLogger.debug("API request received");
```

### Child Loggers

```typescript
import { Logger } from "@asb/logger";

const UserLogger = Logger.createChild("USER");
UserLogger.info("User logged in"); // Output: [timestamp] [INFO] [USER] User logged in
```

## Log Levels

- `DEBUG` (0): Development information
- `INFO` (1): General information
- `WARN` (2): Warning messages
- `ERROR` (3): Error messages

Default level is `DEBUG` in development and `INFO` in production.
