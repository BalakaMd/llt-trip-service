import { Response } from 'express';
import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } from 'sequelize';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: any, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  // Handle Sequelize unique constraint violation
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate entry: this combination already exists',
      details: error.errors.map(e => e.message)
    });
  }

  // Handle Sequelize validation errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: error.errors.map(e => e.message)
    });
  }

  // Handle foreign key constraint errors
  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      status: 'error',
      message: 'Referenced record does not exist'
    });
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
