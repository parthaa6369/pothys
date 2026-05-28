import { ConfigService } from "@pothys/config";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * Guard to protect internal service endpoints using a shared token and service header.
 *
 * Checks for 'x-internal-service' and 'x-internal-token' headers and validates the token
 * against the configured INTERNAL_SERVICE_TOKEN. Adds the service name to the request for logging.
 *
 * @guard InternalServiceGuard
 * @version 1.0.0
 * @author ASB Backend Team
 */
@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check for internal service header
    const internalServiceHeader = request.headers["x-internal-service"];
    const internalToken = request.headers["x-internal-token"];
    console.info(
      `InternalServiceGuard: internalServiceHeader=${internalServiceHeader}, internalToken=${internalToken}`,
    );
    console.log("internalToken: ", internalToken);
    if (!internalServiceHeader || !internalToken) {
      throw new UnauthorizedException(
        "Internal service authentication required",
      );
    }

    // Verify internal token (you can use a shared secret or JWT)
    const expectedToken = this.configService.get("INTERNAL_SERVICE_TOKEN");

    if (!expectedToken || internalToken !== expectedToken) {
      throw new UnauthorizedException("Invalid internal service token");
    }

    // Add service name to request for logging
    request.internalService = internalServiceHeader;

    return true;
  }
}
