import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * Public decorator
 * Marks a route as public (bypasses authentication)
 *
 * @example
 * @Public()
 * @Post('/login')
 * login() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
