import 'dotenv/config'; // Load env vars right at the top
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import config from './config/index.js';

const PORT = config.port || 5001;

// Connect to database
connectDB()
  .then(() => {
    // Start the server only after the DB connection is successful
    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection failed!', err);
    process.exit(1);
  });
