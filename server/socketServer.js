import { Server } from 'socket.io';
import Notification from './models/Notification.js';
import Subscription from './models/Subscription.js';

// 🔁 Exported so controllers can access sockets
export const connectedUsers = new Map(); // userId → socket.id
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

    // Optional: keep this if you want clients to emit "new_post" manually
    socket.on('new_post', async ({ authorId, postId }) => {
      const subs = await Subscription.find({ targetUserId: authorId });

      for (const sub of subs) {
        const notif = new Notification({
          recipientId: sub.subscriberId,
          postId
        });
        await notif.save();

        const recipientSocket = connectedUsers.get(sub.subscriberId.toString());
        if (recipientSocket) {
          io.to(recipientSocket).emit('notification', {
            postId,
            message: 'New post available!'
          });
        }
      }
    });
  });

  return io;
}
