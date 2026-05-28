/**
 * Standard user interface for authentication
 */
export const RoleTypes = {
  USER: { id: "1", name: "USER" },
  ADMIN: { id: "2", name: "ADMIN" },
} as const;

export interface AuthUser {
  user: {
    user_id: string;
    name: string;
    email?: string;
    mobile?: string;
  };
  role: {
    id: string;
    name: string;
  };
}

export interface JwtPayload {
  sub: string;
  user: {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
  };
  role: {
    id: string;
    name: string;
  };
  pillar: {
    id: string;
    name: string;
  };
}

export interface JwtUser {
  id: string;
  user: {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
  };
  role: {
    id: string;
    name: string;
  };
  pillar: {
    id: string;
    name: string;
  };
}

/**
 * JWT token payload structure
 */
export interface AuthTokenPayload {
  sub: string; // User ID
  iat?: number; // Issued at
  exp?: number; // Expires at
}

/**
 * Login response structure
 */
export interface LoginResponse {
  success: boolean; // Indicates if login was successful
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
  expires_in?: number;
}

/**
 * Auth configuration options
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}

export interface LocalAuthResult {
  success: boolean;
  message?: string;
  result?: AuthUser;
}

/**
 * Role-based access control
 */
export interface RolePermission {
  role: string;
  permissions: string[];
}

/**
 * Auth service interface that microservices should implement
 */
export interface IAuthService {
  // validateUser(
  //   req: Request,
  //   username: string,
  //   password: string,
  // ): Promise<LocalAuthResult>;
  // login(user: AuthUser): Promise<LoginResponse>;
  validateToken(token: string): Promise<AuthUser | null>;
  // refresh(refreshToken: string): Promise<LoginResponse>;
}
