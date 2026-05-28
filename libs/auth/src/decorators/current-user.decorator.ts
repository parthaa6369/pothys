import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Current User decorator
 * Extracts the current user from the request object
 *
 * @example
 * @Get('/profile')
 * getProfile(@CurrentUser() user: JwtUser) {
 *   return user;
 * }
 *
 * @example Get specific property
 * @Get('/my-id')
 * getMyId(@CurrentUser('id') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
