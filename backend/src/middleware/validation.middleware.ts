import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../types/index.js';

// Validation schemas
const scrapeRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  options: z.object({
    waitForSelector: z.string().optional(),
    timeout: z.number().min(1000).max(120000).optional(), // Allow up to 2 minutes
    includeAIAnalysis: z.boolean().optional()
  }).optional()
});

export const validateScrapeRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const validated = scrapeRequestSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      next(new AppError(400, `Validation error: ${message}`));
    } else {
      next(error);
    }
  }
};
