import { Server } from 'socket.io';
import Notification from './models/Notification.js';
import Subscription from './models/Subscription.js';

export const connectedUsers = new Map();
export let ioInstance = null;

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) return socket.disconnect();

    connectedUsers.set(userId, socket.id);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
    });

    socket.on('new_post', async ({ authorId, postId }) => {
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
            postId,
            postTitle: 'New post',
            timestamp: new Date()
          });
        }
      }
    });
  });

  return io;
}
