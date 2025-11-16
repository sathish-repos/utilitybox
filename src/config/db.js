import mongoose from 'mongoose';
import config from './index.js';
import logger from './logger.js';

/**
 * @type {import('mongoose').Connection}
 */
let cachedConnection = null;

/**
 * Connects to MongoDB.
 * Implements connection caching for serverless environments (like Vercel).
 * In serverless, functions can be frozen and re-used. Caching avoids
 * creating a new DB connection on every single invocation.
 */
const connectDB = async () => {
  // If we already have a connection, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info('Using cached MongoDB connection.');
    return cachedConnection;
  }

  if (!config.mongodbUri) {
    logger.error('MONGODB_URI is not defined in environment variables.');
    throw new Error('MONGODB_URI is not defined.');
  }

  try {
    logger.info('Creating new MongoDB connection...');

    // Mongoose 5+ options are set by default.
    // We can add serverless-specific optimizations here if needed.
    const connection = await mongoose.connect(config.mongodbUri, {
      // These options are good for serverless:
      // Keep connection alive, but time out idle connections
      // (Note: `serverSelectionTimeoutMS` is good, but `socketTimeoutMS` can be aggressive)
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    cachedConnection = connection.connection;
    logger.info('MongoDB connected successfully.');

    // --- Connection Event Listeners (optional but good) ---
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });

    return cachedConnection;
  } catch (error) {
    logger.error('Could not connect to MongoDB:', error.message);
    // In a serverless function, we might just let it fail.
    // In a long-running process, we'd exit.
    process.exit(1);
  }
};

export default connectDB;
