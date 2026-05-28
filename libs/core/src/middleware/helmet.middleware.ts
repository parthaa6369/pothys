import helmet from "helmet";

/**
 * Helmet Security Middleware
 *
 * Helmet helps secure Express apps by setting various HTTP headers.
 * By default, helmet() provides comprehensive security including:
 * - Content Security Policy (CSP)
 * - DNS Prefetch Control
 * - Frameguard (X-Frame-Options)
 * - Hide Powered-By header
 * - HTTP Strict Transport Security (HSTS)
 * - IE No Open
 * - Don't Sniff Mimetype
 * - Referrer Policy
 * - X-XSS-Protection
 * - And more...
 */

/**
 * Default helmet middleware with all security features
 * Provides comprehensive security out of the box
 */
export const helmetMiddleware = helmet();

/**
 * Development-friendly helmet middleware
 * Disables CSP to allow Swagger UI and development tools
 */
export const helmetDevMiddleware = helmet({
  contentSecurityPolicy: false,
});

/**
 * API-optimized helmet middleware
 * Good for REST APIs with some CSP relaxation
 */
export const helmetApiMiddleware = helmet({
  contentSecurityPolicy: false, // Allow for API documentation tools
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin API calls
});
