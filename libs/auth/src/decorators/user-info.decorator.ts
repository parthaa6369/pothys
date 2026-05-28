import { createParamDecorator, ExecutionContext } from "@nestjs/common";

interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  // Add any other user properties you need
}

/**
 * Extracts the user info from the validated JWT payload (request.user)
 * Usage: @UserInfo() user: User
 */
export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest();
    console.log("Request User for decorator:", request.user);
    return request.user?.user;
  },
);
