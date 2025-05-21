import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import configurePassport from './config/passport.js';
import connectDB from './config/db.js';
import setupSocket, { ioInstance, connectedUsers } from './socketServer.js'; // ✅ Imports

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Passport strategy setup
configurePassport();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax',
    secure: false
  }
});
app.use(sessionMiddleware);

// Passport session middleware
app.use(passport.initialize());
app.use(passport.session());

// Inject socket.io and user map into requests
app.use((req, res, next) => {
  req.io = ioInstance;
  req.ioUsers = connectedUsers;
  next();
});

// Routes
import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscriptions.js';
import notificationRoutes from './routes/notifications.js';
import postRoutes from './routes/posts.js';


app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);


// Root test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server and attach socket.io
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
setupSocket(server); // ✅ Attach socket.io
