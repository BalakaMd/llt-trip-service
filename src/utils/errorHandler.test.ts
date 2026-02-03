import { AppError, handleError } from './errorHandler';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } from 'sequelize';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Stack test', 500);
    
    expect(error.stack).toBeDefined();
  });
});

describe('handleError', () => {
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
    };
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Not found', 404);
    
    handleError(error, mockRes as Response);
    
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Not found',
    });
  });

  it('should handle UniqueConstraintError', () => {
    const error = new UniqueConstraintError({
      errors: [{ message: 'Duplicate entry' } as any],
    });
    
    handleError(error, mockRes as Response);
    
    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Duplicate entry: this combination already exists',
      details: ['Duplicate entry'],
    });
  });

  it('should handle ValidationError', () => {
    const error = new ValidationError('Validation failed', [
      { message: 'Field is required' } as any,
    ]);
    
    handleError(error, mockRes as Response);
    
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation error',
      details: ['Field is required'],
    });
  });

  it('should handle ForeignKeyConstraintError', () => {
    const error = new ForeignKeyConstraintError({} as any);
    
    handleError(error, mockRes as Response);
    
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Referenced record does not exist',
    });
  });

  it('should handle unexpected errors with 500 status', () => {
    const error = new Error('Unexpected error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    handleError(error, mockRes as Response);
    
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
    });
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
