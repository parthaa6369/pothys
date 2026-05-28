import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Extracts the user id from the validated JWT payload (request.user.id)
 * Usage: @UserId() userId: string
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    console.log("Got inside userId decorator");
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);
