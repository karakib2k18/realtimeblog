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

// Connect DB
connectDB();
configurePassport();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    secure: false
  }
});
app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Inject socket.io
app.use((req, res, next) => {
  req.io = ioInstance;
  req.ioUsers = connectedUsers;
  next();
});

// Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import subscriptionRoutes from './routes/subscriptions.js';
import notificationRoutes from './routes/notifications.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.send('API is running...'));

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

setupSocket(server);
