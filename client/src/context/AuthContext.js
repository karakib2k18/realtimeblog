import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
      withCredentials: true
    })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null)); // ✅ Safely reset user on 401
  }, []);
  
  const logout = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    }).then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
