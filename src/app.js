import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import { globalRateLimiter } from './middleware/rateLimiter.middleware.js';
import globalErrorHandler from './middleware/errorHandler.middleware.js';
import apiV1Router from './api/index.js';
import { ApiError } from './core/ApiError.js';
import httpStatus from 'http-status';

const app = express();

// --- Global Middleware ---

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Enable CORS
const corsOptions = {
  origin: config.corsOrigin,
  optionsSuccessStatus: 200, // For legacy browsers
};
app.use(cors(corsOptions));

// 3. JSON Parsing
app.use(express.json({ limit: '10kb' }));

// 4. URL-encoded Parsing
app.use(express.urlencoded({ extended: true }));

// 5. HTTP Request Logging (using morgan)
// We use a simple 'dev' format for local development.
// For production, Vercel provides its own request logging.
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// 6. Global Rate Limiting (to prevent abuse)
app.use(globalRateLimiter);

// --- API Routes ---

// Mount all v1 routes under /api/v1
app.use('/api/v1', apiV1Router);

// --- Health Check Route ---
// Useful for uptime monitoring
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy and running!',
    timestamp: new Date().toISOString(),
  });
});

// --- 404 Not Found Handler ---
// Catch all unhandled routes
app.all('*', (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Can't find ${req.originalUrl} on this server!`));
});

// --- Global Error Handler ---
// This must be the LAST middleware
app.use(globalErrorHandler);

export default app;