import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

// Subscribe to an author
export const subscribeToAuthor = async (req, res) => {
  const { authorId } = req.params;

  if (authorId === req.user._id.toString()) {
    return res.status(400).json({ error: "You can't subscribe to yourself." });
  }

  const exists = await Subscription.findOne({
    subscriberId: req.user._id,
    targetUserId: authorId
  });

  if (exists) return res.status(400).json({ error: 'Already subscribed' });

  await Subscription.create({
    subscriberId: req.user._id,
    targetUserId: authorId
  });

  res.json({ message: 'Subscribed successfully' });
};

// Unsubscribe
export const unsubscribeFromAuthor = async (req, res) => {
  const { authorId } = req.params;

  await Subscription.deleteOne({
    subscriberId: req.user._id,
    targetUserId: authorId
  });

  res.json({ message: 'Unsubscribed successfully' });
};

// Get all subscriptions for current user
export const getUserSubscriptions = async (req, res) => {
  const subs = await Subscription.find({ subscriberId: req.user._id }).populate('targetUserId', 'name');
  res.json({ subscriptions: subs.map(sub => ({
    id: sub.targetUserId._id,
    name: sub.targetUserId.name
  })) });
};
