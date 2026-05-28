export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerConfig {
  level: LogLevel;
  includeTimestamp: boolean;
  includeLevel: boolean;
  prefix?: string;
}

export class Logger {
  private static config: LoggerConfig = {
    level:
      process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
    includeTimestamp: true,
    includeLevel: true,
  };

  static configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  private static formatMessage(level: string, message: string): string {
    const parts: string[] = [];

    if (this.config.includeTimestamp) {
      parts.push(new Date().toISOString());
    }

    if (this.config.includeLevel) {
      parts.push(`[${level}]`);
    }

    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    parts.push(message);

    return parts.join(" ");
  }

  private static shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  static debug(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage("DEBUG", message), ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage("INFO", message), ...args);
    }
  }

  static warn(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("WARN", message), ...args);
    }
  }

  static error(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("ERROR", message), ...args);
    }
  }

  static createChild(prefix: string): typeof Logger {
    const childLogger = class extends Logger {};
    childLogger.configure({ ...this.config, prefix });
    return childLogger;
  }
}

// Create pre-configured loggers for common use cases
export const AppLogger = Logger.createChild("APP");
export const DbLogger = Logger.createChild("DB");
export const ApiLogger = Logger.createChild("API");

// Default export
export default Logger;
