import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errorHandler';

type ValidationType = 'body' | 'params' | 'query';

export const validate = (schema: Joi.ObjectSchema, type: ValidationType = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[type];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(messages, 400));
    }

    req[type] = value;
    next();
  };
};
