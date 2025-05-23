import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', ensureAuthenticated, createPost);
router.put('/:id', ensureAuthenticated, updatePost);
router.delete('/:id', ensureAuthenticated, deletePost);

export default router;
