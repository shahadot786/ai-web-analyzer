import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error',
      statusCode: 500
    }
  });
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};
