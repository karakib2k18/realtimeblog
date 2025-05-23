import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Real-time notifications via Socket.io
  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: { userId: user._id },
        withCredentials: true
      });

      newSocket.on('notification', (data) => {
        toast.info(`🆕 New post: ${data.postTitle}`, {
          position: 'bottom-right',
          autoClose: 4000,
          pauseOnHover: true,
          theme: 'light'
        });

        setNotifications(prev => [
          {
            ...data,
            id: Date.now(), // Temporary ID
            seen: false,
            isLive: true
          },
          ...prev
        ]);
      });

      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [user]);

  // ✅ Fetch missed (unseen) notifications after login
  useEffect(() => {
    if (user) {
      fetchMissedNotifications();
    }
  }, [user]);

  const fetchMissedNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        withCredentials: true
      });

      const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNotifications(prev => [
        ...sorted.map(n => ({ ...n, isLive: false })),
        ...prev
      ]);
    } catch (err) {
      console.error('🔴 Failed to fetch missed notifications:', err);
    }
  };

  const markAllAsSeen = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/notifications/mark-seen`, {}, {
        withCredentials: true
      });
      setNotifications([]);
    } catch (err) {
      console.error('🔴 Failed to mark all notifications as seen:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      setNotifications, // ✅ EXPOSED
      markAllAsSeen
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
