import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost,
  addComment
} from '../controllers/postController.js';
import { protect, restrictTo, canComment, canManageContent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Comment route
router.post('/:postId/comment', protect, canComment, addComment);

// Protected routes (admin only)
router.post('/', protect, restrictTo('admin'), createPost);

// Admin content management routes
router.delete('/:postId', protect, canManageContent, deletePost);
router.put('/:postId', protect, canManageContent, updatePost);

export default router;
