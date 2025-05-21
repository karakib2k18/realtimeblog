import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById
} from '../controllers/postController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', ensureAuthenticated, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);

export default router;
