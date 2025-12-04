import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
    return;
  }

  console.error('Unexpected error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
