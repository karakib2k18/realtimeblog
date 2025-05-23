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
import setupSocket, { ioInstance, connectedUsers } from './socketServer.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Configure Passport strategies
configurePassport();

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Session Middleware
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

// ✅ Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Inject io + user map into requests
app.use((req, res, next) => {
  req.io = ioInstance;
  req.ioUsers = connectedUsers;
  next();
});

// ✅ Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import subscriptionRoutes from './routes/subscriptions.js';
import notificationRoutes from './routes/notifications.js';
import authorRoutes from './routes/authors.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/authors', authorRoutes);

// ✅ Root Test
app.get('/', (req, res) => res.send('API is running...'));

// ✅ Start Server + Socket
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

setupSocket(server, sessionMiddleware); // ✅ MUST pass sessionMiddleware here
