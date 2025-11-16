import express from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/user.routes.js';
import productRoutes from './products/product.routes.js';
import healthRoutes from './health/health.routes.js';

const router = express.Router();

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/health', healthRoutes);

export default router;
