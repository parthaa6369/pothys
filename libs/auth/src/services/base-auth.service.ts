import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  AuthUser,
  IAuthService,
  LocalAuthResult,
  LoginResponse,
} from "../types";

/**
 * Base Auth Service
 * Provides common authentication functionality
 * Microservices should extend this and implement the abstract methods
 */
@Injectable()
export abstract class BaseAuthService implements IAuthService {
  constructor(protected readonly jwtService: JwtService) {}

  /**
   * Validate user credentials
   * Must be implemented by microservice
   */
  // abstract validateUser(
  //   req: Request,
  //   username: string,
  //   password: string,
  // ): Promise<LocalAuthResult>;

  /**
   * Find user by ID
   * Must be implemented by microservice
   */
  // abstract findAuthUserById(id: string): Promise<AuthUser | null>;

  /**
   * Generate JWT tokens for authenticated user
   */
  async login(user: AuthUser): Promise<LoginResponse> {
    console.log(`Generating JWT token for user: ${JSON.stringify(user)}`);
    const payload = {
      user: {
        user_id: user.user.user_id,
        email: user.user?.email ?? "",
        name: user.user?.name ?? "",
        mobile: user.user?.mobile ?? "",
      },
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: "7d" });
    return {
      success: true,
      access_token,
      refresh_token,
      user,
      expires_in: 3600, // 1 hour
    };
  }

  /**
   * Validate JWT token and return user
   */
  async validateToken(token: string): Promise<AuthUser | null> {
    try {
      const payload = this.jwtService.verify(token);
      return payload ? payload : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token
   * Basic implementation - can be overridden for more complex refresh logic
   */
  // async refresh(refreshToken: string): Promise<LoginResponse> {
  //   try {
  //     const payload = this.jwtService.verify(refreshToken);

  //     const user = await this.findAuthUserById(payload.sub);

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     return this.login(user);
  //   } catch (error) {
  //     throw new Error("Invalid refresh token");
  //   }
  // }
}
