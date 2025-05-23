import Notification from '../models/Notification.js';
import Post from '../models/Post.js';

// ✅ 1. Get unseen notifications
export const getUnseenNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({
      recipientId: req.user._id,
      seen: false
    }).populate('postId');

    const formatted = notifs.map(n => ({
      id: n._id,
      postId: n.postId?._id,
      postTitle: n.postId?.title || 'New Post',
      authorId: n.postId?.author,
      authorName: n.postId?.author?.name || '',
      timestamp: n.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ getUnseenNotifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// ✅ 2. Mark ALL notifications as seen
export const markNotificationsAsSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: 'Marked all as seen' });
  } catch (err) {
    console.error('❌ markNotificationsAsSeen error:', err);
    res.status(500).json({ error: 'Failed to mark notifications as seen' });
  }
};

// ✅ 3. Mark ONE notification as seen (for a specific post)
export const markSingleNotificationAsSeen = async (req, res) => {
  const { postId } = req.body;
  try {
    await Notification.updateOne(
      { postId, recipientId: req.user._id },
      { $set: { seen: true } }
    );
    res.json({ message: 'Marked as seen' });
  } catch (err) {
    console.error('❌ markSingleNotificationAsSeen error:', err);
    res.status(500).json({ error: 'Failed to mark notification as seen' });
  }
};
