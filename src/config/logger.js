import winston from 'winston';
import config from './index.js';

const { format, transports } = winston;
const { combine, timestamp, json, colorize, printf, errors } = format;

// Define a custom format for development (more readable)
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Use JSON format for production (and other environments)
// This is structured and easily parsable by log aggregators (like Vercel Logs)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }), // Log stack traces
  json()
);

const logger = winston.createLogger({
  level: config.logLevel || 'info',

  // Use 'devFormat' in development, 'prodFormat' otherwise
  format:
    config.env === 'development'
      ? combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), devFormat)
      : prodFormat,

  transports: [
    new transports.Console(),
    // In a non-serverless prod env, you'd add file transports:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],

  // Do not exit on unhandled exceptions
  exitOnError: false,
});

export default logger;
