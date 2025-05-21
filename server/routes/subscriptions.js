import express from 'express';
import {
  subscribeToAuthor,
  unsubscribeFromAuthor,
  getUserSubscriptions
} from '../controllers/subscriptionController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:authorId', ensureAuthenticated, subscribeToAuthor);
router.delete('/:authorId', ensureAuthenticated, unsubscribeFromAuthor);
router.get('/', ensureAuthenticated, getUserSubscriptions);

export default router;
