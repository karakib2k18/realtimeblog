import express from 'express';
import {
  getUnseenNotifications,
  markNotificationsAsSeen
} from '../controllers/notificationController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ensureAuthenticated, getUnseenNotifications);
router.patch('/mark-seen', ensureAuthenticated, markNotificationsAsSeen);

export default router;
