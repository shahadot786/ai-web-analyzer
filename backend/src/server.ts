import express, { Express } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import scraperRoutes from './routes/scraper.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { scraperService } from './services/scraper.service.js';
import { websocketService } from './services/websocket.service.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket
websocketService.initialize(server);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Routes
app.use('/api', scraperRoutes);
app.use('/api/export', pdfRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await scraperService.closeBrowser();
  websocketService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await scraperService.closeBrowser();
  websocketService.close();
  process.exit(0);
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🔌 WebSocket enabled on ws://localhost:${PORT}/ws`);
});

export default app;
