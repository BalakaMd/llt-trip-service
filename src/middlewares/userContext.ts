import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        roles?: string | string[];
      };
    }
  }
}

export const userContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Extract user context from headers sent by API Gateway
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  const userRoles = req.headers['x-user-roles'] as string;

  if (userId) {
    req.user = {
      id: userId,
      email: userEmail,
      roles: userRoles
        ? userRoles.includes(',')
          ? userRoles.split(',')
          : userRoles
        : undefined,
    };
  }

  next();
};
