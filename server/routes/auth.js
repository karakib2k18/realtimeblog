import express from 'express';
import passport from 'passport';
import {
  handleLogin,
  handleRegister,
  handleLogout,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

// 🔐 Local auth
router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.post('/logout', handleLogout);
router.get('/user', getCurrentUser);

// 🔐 Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google callback handler (redirects to frontend)
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: `${'http://localhost:3000'}/login`
  })
);

// Optional: get logged-in Google user as JSON
router.get('/google/success', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

export default router;
