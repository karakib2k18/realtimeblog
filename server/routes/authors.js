import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/authors → list all authors
router.get('/', async (req, res) => {
  try {
    const authors = await User.find({}, 'name _id');
    res.json(authors);
  } catch (err) {
    console.error('Failed to fetch authors', err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

export default router;
