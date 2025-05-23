import express from 'express';
import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get unseen notifications
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id,
      seen: false
    })
    .sort({ createdAt: -1 })
    .populate('postId', 'title author');

    const formatted = notifications.map(n => ({
      id: n._id,
      postId: n.postId?._id,
      postTitle: n.postId?.title || 'New Post',
      authorId: n.postId?.author?._id || null,
      authorName: n.postId?.author?.name || '',
      timestamp: n.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[GET /notifications] ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ✅ Mark ALL as seen
router.patch('/mark-seen', ensureAuthenticated, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: 'Marked all as seen' });
  } catch (err) {
    console.error('[PATCH /notifications/mark-seen] ERROR:', err);
    res.status(500).json({ error: 'Failed to mark notifications' });
  }
});

// ✅ Mark ONE notification as seen
router.patch('/mark-single', ensureAuthenticated, async (req, res) => {
  const { postId } = req.body;

  if (!postId) return res.status(400).json({ error: 'postId is required' });

  try {
    await Notification.updateOne(
      { postId, recipientId: req.user._id },
      { $set: { seen: true } }
    );
    res.json({ message: 'Marked one notification as seen' });
  } catch (err) {
    console.error('[PATCH /notifications/mark-single] ERROR:', err);
    res.status(500).json({ error: 'Failed to mark single notification' });
  }
});

export default router;
