import Notification from '../models/Notification.js';
import Post from '../models/Post.js';

export const getUnseenNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({
      recipientId: req.user._id,
      seen: false
    }).populate('postId');

    const formatted = notifs.map(n => ({
      id: n._id,
      postId: n.postId._id,
      postTitle: n.postId.title,
      timestamp: n.createdAt
    }));

    res.json({ notifications: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationsAsSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: 'Marked as seen' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications as seen' });
  }
};
