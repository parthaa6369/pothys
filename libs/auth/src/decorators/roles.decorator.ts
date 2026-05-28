import { SetMetadata } from "@nestjs/common";

/**
 * Roles decorator
 * Used to specify which roles are required to access a route
 *
 * @example
 * @Roles('admin', 'user')
 * @Get('/protected')
 * protectedRoute() {}
 */
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
