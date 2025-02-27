import express from 'express';
import { 
  register, 
  login, 
  upgradeUserRole,
  validateToken,
  updateProfile,
  getAllUsers,
  deleteUser
} from '../controllers/authController.js';
import { protect, restrictTo, canEditProfile } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/validate', protect, validateToken);

// Protected routes
router.post(
  '/upgrade-role', 
  protect, 
  restrictTo('admin'), 
  upgradeUserRole
);

// Update user profile route
router.put('/profile/:id', protect, canEditProfile, updateProfile);

// Admin routes
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

export default router;
