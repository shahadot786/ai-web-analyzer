import { Router, Request, Response, NextFunction } from 'express';
import { scraperService } from '../services/scraper.service.js';
import { aiService } from '../services/ai.service.js';
import { analyticsService } from '../services/analytics.service.js';
import { cacheService } from '../services/cache.service.js';
import { validateScrapeRequest } from '../middleware/validation.middleware.js';
import type { ScrapeRequest, ScrapeResult } from '../types/index.js';
import { randomUUID } from 'crypto';

const router = Router();

// In-memory storage for scraping results (in production, use a database)
export const scrapeResults = new Map<string, ScrapeResult>();
const scrapeHistory: { id: string; url: string; timestamp: Date }[] = [];

// Active scraping jobs for cancellation
const activeJobs = new Map<string, boolean>();

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
      const useCache = options?.useCache !== false; // Default to true

      // Check cache first
      if (useCache) {
        const cached = cacheService.get(url);
        if (cached) {
          console.log(`Cache hit for ${url}`);
          res.status(200).json({
            success: true,
            data: cached,
            cached: true
          });
          return;
        }
      }

      // Generate unique ID for this scrape
      const id = randomUUID();
      activeJobs.set(id, true);

      // Scrape the website
      const scrapedData = await scraperService.scrapeWebsite(url, options);

      // Check if job was cancelled
      if (!activeJobs.get(id)) {
        res.status(499).json({
          success: false,
          error: {
            message: 'Scraping cancelled',
            statusCode: 499
          }
        });
        return;
      }

      // Summarize paragraphs with AI
      if (includeAIAnalysis && scrapedData.paragraphs.length > 0) {
        scrapedData.paragraphs = await aiService.summarizeParagraphs(scrapedData.paragraphs);
      }

      // Check if job was cancelled
      if (!activeJobs.get(id)) {
        res.status(499).json({
          success: false,
          error: {
            message: 'Scraping cancelled',
            statusCode: 499
          }
        });
        return;
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

      // Cache the result
      if (useCache) {
        cacheService.set(url, result);
      }

      // Keep only last 50 results in memory
      if (scrapeHistory.length > 50) {
        const oldestId = scrapeHistory.pop()?.id;
        if (oldestId) {
          scrapeResults.delete(oldestId);
        }
      }

      // Clean up active job
      activeJobs.delete(id);

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
 * DELETE /api/cancel/:id
 * Cancel an ongoing scraping job
 */
router.delete(
  '/cancel/:id',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      
      if (activeJobs.has(id)) {
        activeJobs.set(id, false);
        res.status(200).json({
          success: true,
          message: 'Scraping job cancelled'
        });
      } else {
        res.status(404).json({
          success: false,
          error: {
            message: 'Job not found or already completed',
            statusCode: 404
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/cache/stats
 * Get cache statistics
 */
router.get(
  '/cache/stats',
  (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const stats = cacheService.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/cache/clear
 * Clear all cache
 */
router.delete(
  '/cache/clear',
  (_req: Request, res: Response, next: NextFunction): void => {
    try {
      cacheService.clear();
      res.status(200).json({
        success: true,
        message: 'Cache cleared'
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
