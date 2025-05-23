import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import Subscription from "../models/Subscription.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = new Post({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      author: req.user._id,
    });

    await post.save();

    // 🔔 Notify all subscribers
    const subs = await Subscription.find({ targetUserId: req.user._id });

    for (const sub of subs) {
      await Notification.create({
        recipientId: sub.subscriberId,
        postId: post._id,
        seen: false,
        createdAt: new Date()
      });

      const recipientSocket = req.ioUsers?.get(sub.subscriberId.toString());
      if (recipientSocket) {
        req.io?.to(recipientSocket).emit("notification", {
          postId: post._id.toString(),     // 🔄 Ensure it's a string
          postTitle: post.title,
          authorId: req.user._id.toString(),  // 🔄 Ensure consistency
          authorName: req.user.name,
          timestamp: new Date(),
        });
      }
    }

    res.status(201).json({
      message: "Post created and notifications sent",
      post
    });

  } catch (err) {
    console.error("[POST /api/posts] Create Error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.json(posts);
  } catch (err) {
    console.error("[GET /api/posts] ERROR:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("[GET /api/posts/:id] ERROR:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = Array.isArray(tags) ? tags : [];

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error("[PUT /api/posts/:id] Update Error:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure only the author can delete
    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("[DELETE /api/posts/:id] ERROR:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
