import Notification from '../models/Notification.js';
import Post from '../models/Post.js';

// GET /notifications → fetch unseen
export const getUnseenNotifications = async (req, res) => {
  const unseen = await Notification.find({
    recipientId: req.user._id,
    seen: false
  }).populate('postId', 'title').sort({ createdAt: -1 });

  const formatted = unseen.map(n => ({
    id: n._id,
    postId: n.postId._id,
    postTitle: n.postId.title,
    timestamp: n.createdAt
  }));

  res.json({ notifications: formatted });
};

// PATCH /notifications/mark-seen → mark all as seen
export const markNotificationsAsSeen = async (req, res) => {
  await Notification.updateMany({ recipientId: req.user._id, seen: false }, { seen: true });
  res.json({ message: 'Notifications marked as seen' });
};
