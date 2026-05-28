# @asb/auth

Authentication package for ASB microservices providing JWT authentication, role-based access control, and common auth utilities.

## Features

- 🔐 **JWT Authentication** - Token-based authentication with Passport
- 🛡️ **Role-based Access Control** - Protect routes with roles and permissions
- 🎯 **Decorators** - Easy-to-use decorators for auth logic
- 🔒 **Guards** - Pre-built guards for route protection
- 🔧 **Strategies** - Extensible authentication strategies
- 📝 **TypeScript** - Full TypeScript support with type definitions

## Installation

This package is part of the ASB monorepo and is automatically available to all microservices.

## Usage

### Basic Setup

1. **Import in your module:**

```typescript
import { JwtAuthGuard, RolesGuard } from "@asb/auth";

@Module({
  providers: [JwtAuthGuard, RolesGuard],
})
export class YourModule {}
```

2. **Protect routes with guards:**

```typescript
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from "@asb/auth";

@Controller("protected")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProtectedController {
  @Get()
  @Roles("admin", "user")
  getProtectedData(@CurrentUser() user: AuthUser) {
    return { message: "This is protected", user };
  }
}
```

### Decorators

#### @CurrentUser()

Extract current user from request:

```typescript
@Get('/profile')
getProfile(@CurrentUser() user: AuthUser) {
  return user;
}

// Get specific property
@Get('/my-id')
getMyId(@CurrentUser('id') userId: string) {
  return userId;
}
```

#### @Roles()

Specify required roles for route access:

```typescript
@Roles('admin', 'manager')
@Get('/admin-only')
adminOnlyRoute() {
  return 'Admin content';
}
```

#### @Public()

Mark routes as public (bypass authentication):

```typescript
@Public()
@Post('/login')
login() {
  return 'Login endpoint';
}
```

### Guards

#### JwtAuthGuard

Validates JWT tokens:

```typescript
@UseGuards(JwtAuthGuard)
@Get('/protected')
protectedRoute() {}
```

#### RolesGuard

Checks user roles (use with JwtAuthGuard):

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('/admin')
adminRoute() {}
```

#### LocalAuthGuard

For username/password authentication:

```typescript
@UseGuards(LocalAuthGuard)
@Post('/login')
login() {}
```

### Strategies

#### JWT Strategy

Extend for custom user validation:

```typescript
@Injectable()
export class CustomJwtStrategy extends JwtStrategy {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super(configService);
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

#### Local Strategy

Implement for custom login validation:

```typescript
@Injectable()
export class CustomLocalStrategy extends LocalStrategy {
  constructor(private authService: AuthService) {
    super();
  }

  async validateUser(
    req: any,
    username: string,
    password: string,
  ): Promise<LocalAuthUser> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}
```

### Services

#### BaseAuthService

Extend for common auth functionality:

```typescript
@Injectable()
export class AuthService extends BaseAuthService {
  constructor(
    jwtService: JwtService,
    private userService: UserService,
  ) {
    super(jwtService);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await this.validatePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    return this.userService.findById(id);
  }
}
```

## Types

The package exports several TypeScript interfaces:

- `AuthUser` - Standard user interface
- `AuthTokenPayload` - JWT payload structure
- `LoginResponse` - Login response format
- `IAuthService` - Auth service interface
- `JwtPayload`, `JwtUser` - JWT-specific types
- `LocalAuthUser` - Local auth user type

## Environment Variables

Required environment variables:

```env
JWT_SECRET=your-base64-encoded-secret
```

Optional:

```env
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Best Practices

1. **Always use JwtAuthGuard with RolesGuard** for role-based protection
2. **Extend strategies** rather than using them directly
3. **Use @Public() decorator** for routes that don't need authentication
4. **Implement proper error handling** in your auth service
5. **Use strong JWT secrets** and rotate them regularly

## Migration from Local Auth

To migrate from local auth implementation:

1. Replace local imports with `@asb/auth` imports
2. Extend base classes instead of implementing from scratch
3. Update decorators to use the standardized versions
4. Implement abstract methods in base services

## Contributing

When contributing to this package:

1. Follow the established patterns
2. Add tests for new functionality
3. Update documentation
4. Ensure backward compatibility
