import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as loginApi, getAdminProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('clicksansar_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const profile = await getAdminProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const data = await loginApi(username, password);
    localStorage.setItem('clicksansar_token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      username: data.username,
      email: data.email,
      role: data.role,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('clicksansar_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
