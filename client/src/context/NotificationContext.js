import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect to Socket.io
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', {
        auth: { userId: user._id },
        withCredentials: true
      });

      newSocket.on('notification', (data) => {
        setNotifications((prev) => [
          {
            id: Date.now(),
            postId: data.postId,
            postTitle: data.postTitle || 'New Post',
            timestamp: new Date(),
          },
          ...prev
        ]);
      });

      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [user]);

  // Fetch unseen notifications
  useEffect(() => {
    const fetchUnseen = async () => {
      if (user) {
        const res = await axios.get('http://localhost:5000/api/notifications', { withCredentials: true });
        setNotifications(res.data.notifications);
      }
    };
    fetchUnseen();
  }, [user]);

  // Mark as seen (e.g., when dropdown opens)
  const markAllAsSeen = async () => {
    await axios.patch('http://localhost:5000/api/notifications/mark-seen', {}, { withCredentials: true });
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsSeen }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
