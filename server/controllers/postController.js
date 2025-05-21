import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import Subscription from '../models/Subscription.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = new Post({
      title,
      content,
      tags,
      author: req.user._id
    });

    await post.save();

    const subs = await Subscription.find({ targetUserId: req.user._id });

    for (const sub of subs) {
      await Notification.create({
        recipientId: sub.subscriberId,
        postId: post._id,
        seen: false
      });

      const recipientSocket = req.ioUsers.get(sub.subscriberId.toString());
      if (recipientSocket) {
        req.io.to(recipientSocket).emit('notification', {
          postId: post._id,
          postTitle: post.title,
          timestamp: new Date()
        });
      }
    }

    res.status(201).json({ message: 'Post created and notifications sent', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error('[GET /api/posts] ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('[GET /api/posts/:id] ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};
