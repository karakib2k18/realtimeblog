import { Server } from 'socket.io';
import sharedSession from 'express-socket.io-session';
import Notification from './models/Notification.js';
import Subscription from './models/Subscription.js';

export const connectedUsers = new Map();   // ✅ Exported
export let ioInstance = null;              // ✅ Exported

export default function setupSocket(server, sessionMiddleware) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  });

  ioInstance = io;

  // ✅ Share session with Socket.io
  io.use(sharedSession(sessionMiddleware, { autoSave: true }));

  io.on('connection', (socket) => {
    const userId = socket.handshake?.session?.passport?.user;
    if (!userId) return socket.disconnect();

    connectedUsers.set(userId, socket.id);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
    });

    // ✅ Emit post notification to each online subscriber
    socket.on('new_post', async ({ authorId, postId, postTitle }) => {
      try {
        const subs = await Subscription.find({ targetUserId: authorId });

        for (const sub of subs) {
          await Notification.create({
            recipientId: sub.subscriberId,
            postId,
            seen: false,
            createdAt: new Date()
          });

          const recipientSocket = connectedUsers.get(sub.subscriberId.toString());
          if (recipientSocket) {
            io.to(recipientSocket).emit('notification', {
              postId: postId.toString(), // ✅ Fix: ensure it's a string
              postTitle: postTitle || 'New Post',
              timestamp: new Date()
            });
          }
        }
      } catch (err) {
        console.error('🔴 Socket new_post error:', err);
      }
    });
  });

  return io;
}
