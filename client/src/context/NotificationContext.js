import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: { userId: user._id },
        withCredentials: true
      });

      newSocket.on('notification', (data) => {
        setNotifications(prev => [
          { ...data, id: Date.now() },
          ...prev
        ]);
      });

      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        withCredentials: true
      }).then(res => {
        setNotifications(res.data.notifications);
      });
    }
  }, [user]);

  const markAllAsSeen = async () => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/api/notifications/mark-seen`, {}, {
      withCredentials: true
    });
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsSeen }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
