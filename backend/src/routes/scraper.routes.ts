import { Router, Request, Response, NextFunction } from 'express';
import { scraperService } from '../services/scraper.service.js';
import { aiService } from '../services/ai.service.js';
import { analyticsService } from '../services/analytics.service.js';
import { validateScrapeRequest } from '../middleware/validation.middleware.js';
import type { ScrapeRequest, ScrapeResult } from '../types/index.js';
import { randomUUID } from 'crypto';

const router = Router();

// In-memory storage for scraping results (in production, use a database)
export const scrapeResults = new Map<string, ScrapeResult>();
const scrapeHistory: { id: string; url: string; timestamp: Date }[] = [];

/**
 * POST /api/scrape
 * Scrape a website and analyze its content
 */
router.post(
  '/scrape',
  validateScrapeRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url, options }: ScrapeRequest = req.body;
      const includeAIAnalysis = options?.includeAIAnalysis !== false; // Default to true

      // Generate unique ID for this scrape
      const id = randomUUID();

      // Scrape the website
      const scrapedData = await scraperService.scrapeWebsite(url, options);

      // Summarize paragraphs with AI
      if (includeAIAnalysis && scrapedData.paragraphs.length > 0) {
        scrapedData.paragraphs = await aiService.summarizeParagraphs(scrapedData.paragraphs);
      }

      // Generate analytics
      const analytics = analyticsService.generateAnalytics(scrapedData);

      // Generate AI analysis
      let aiAnalysis;
      if (includeAIAnalysis) {
        aiAnalysis = await aiService.analyzeContent(scrapedData);
      } else {
        // Provide minimal AI analysis
        aiAnalysis = {
          contentSummary: 'AI analysis skipped',
          keyTopics: [],
          seoInsights: {
            titleQuality: 'Not analyzed',
            metaDescriptionQuality: 'Not analyzed',
            headingStructure: 'Not analyzed',
            keywordDensity: 'Not analyzed',
            recommendations: []
          },
          contentCategories: []
        };
      }

      // Store result
      const result: ScrapeResult = {
        id,
        data: scrapedData,
        aiAnalysis,
        analytics
      };

      scrapeResults.set(id, result);
      scrapeHistory.unshift({ id, url, timestamp: new Date() });

      // Keep only last 50 results in memory
      if (scrapeHistory.length > 50) {
        const oldestId = scrapeHistory.pop()?.id;
        if (oldestId) {
          scrapeResults.delete(oldestId);
        }
      }

      res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/scrape/:id
 * Get a specific scraping result by ID
 */
router.get(
  '/scrape/:id',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const result = scrapeResults.get(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Scrape result not found',
            statusCode: 404
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/history
 * Get scraping history
 */
router.get(
  '/history',
  (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        success: true,
        data: scrapeHistory
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
