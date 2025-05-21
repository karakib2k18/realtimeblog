import express from 'express';
import passport from 'passport';
import {
  handleLogin,
  handleRegister,
  handleLogout,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.post('/logout', handleLogout);
router.get('/user', getCurrentUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  })
);

export default router;
