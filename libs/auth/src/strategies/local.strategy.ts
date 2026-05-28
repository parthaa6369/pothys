import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

export interface LocalAuthUser {
  id: string;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

export interface ILocalAuthService {
  validateUser(req: Request, username: string, password: string): Promise<any>;
}

/**
 * Local Strategy for username/password authentication
 * This strategy validates user credentials and returns the authenticated user
 * Microservices should inject a service that implements ILocalAuthService
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: ILocalAuthService) {
    super({
      passReqToCallback: true,
      usernameField: "username",
      passwordField: "password",
    });
  }

  async validate(
    req: any,
    username: string,
    password: string,
  ): Promise<LocalAuthUser> {
    const result = await this.authService.validateUser(req, username, password);

    if (!result || !result.success) {
      const message = result?.message || "Invalid credentials";
      throw new UnauthorizedException(message);
    }
    if (!result.success) throw new BadRequestException(result.message);

    return result.result;
  }
}
