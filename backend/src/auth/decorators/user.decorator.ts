import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Define the shape of authenticated user
 * coming from JwtStrategy.validate()
 */
interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

/**
 * Extend Express Request type safely
 */
interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Get only userId from JWT payload
 */
export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user?.userId;
  },
);

/**
 * Get full user object from JWT payload
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
