import { Router, Request, Response } from 'express';
import { pdfService } from '../services/pdf.service.js';
import { scrapeResults } from './scraper.routes.js';
import { AppError } from '../types/index.js';

const router = Router();

// Generate PDF for a scrape result
router.get('/pdf/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the scrape result
    const result = scrapeResults.get(id);
    
    if (!result) {
      throw new AppError(404, 'Scrape result not found');
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDF(result);

    // Set headers for PDF download
    const filename = `ai-web-analyzer-${result.data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode
        }
      });
    } else {
      console.error('PDF Generation Error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to generate PDF',
          statusCode: 500
        }
      });
    }
  }
});

export default router;
