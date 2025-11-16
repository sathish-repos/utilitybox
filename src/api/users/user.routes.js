import express from 'express';
import { protect, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateUserSchema } from './user.validation.js';
import { getAllUsers, getUserById, updateMe, deleteMe } from './user.controller.js';

const router = express.Router();

// All routes below are protected
router.use(protect);

router.get('/me', (req, res) => res.json(req.user)); // Simple route to get profile
router.patch('/me', validate(updateUserSchema), updateMe);
router.delete('/me', deleteMe);

// Admin-only routes
router.get('/', checkRole('admin'), getAllUsers);
router.get('/:id', checkRole('admin'), getUserById);

export default router;
