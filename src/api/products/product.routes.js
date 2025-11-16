import express from 'express';
import { protect, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema } from './product.validation.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from './product.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.use(protect, checkRole('admin'));

router.post('/', validate(createProductSchema), createProduct);
router.patch('/:id', validate(updateProductSchema), updateProductById);
router.delete('/:id', deleteProductById);

export default router;
