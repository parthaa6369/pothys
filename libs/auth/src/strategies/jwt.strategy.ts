import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, JwtUser, AuthUser } from "../types";

/**
 * Base JWT Strategy for validating JWT tokens across all microservices
 * This strategy validates JWT tokens and returns user data from the token payload
 *
 * Usage:
 * - Used by ALL microservices for token validation on protected routes
 * - Validates the JWT token signature and expiration
 * - Returns user data from token payload (no database calls)
 *
 * If a microservice needs to fetch fresh user data from database,
 * they can extend this strategy and override the validate method
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not configured. Please set JWT_SECRET environment variable.",
      );
    }

    const decodedSecret = Buffer.from(jwtSecret, "base64").toString("utf-8");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: decodedSecret,
    });
  }

  /**
   * Validate JWT payload and return user data
   *
   * This validates the token signature and returns user data from the token payload.
   * NO database queries are performed here for performance reasons.
   * All necessary user info should be in the token payload.
   */
  async validate(payload: AuthUser): Promise<AuthUser> {
    // Return user data from token payload - no DB queries needed
    // return {
    //   id: payload.sub,
    //   role: payload.role,
    //   user: payload.user,
    //   pillar: payload.pillar,
    // };
    return {
      user: payload.user,
      role: payload.role,
    };
  }
}
