import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

// Local login using Passport
export const handleLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
};

// Register new user (local)
export const handleRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout
export const handleLogout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};

// Get current logged-in user
export const getCurrentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
};
