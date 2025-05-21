import express from 'express';
import passport from 'passport';
import {
  handleLogin,
  handleRegister,
  handleLogout,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

// Local login
router.post('/login', handleLogin);

// Register
router.post('/register', handleRegister);

// Logout
router.get('/logout', handleLogout);

// Get current logged-in user (for frontend)
router.get('/me', getCurrentUser);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/login',
  })
);

export default router;
