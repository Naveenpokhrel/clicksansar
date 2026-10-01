import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('clicksansar_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('clicksansar_token');
      if (storedToken) {
        try {
          const profile = await getUserProfile(storedToken);
          setUser({ ...profile, token: storedToken });
          setToken(storedToken);
        } catch (err) {
          console.log('Session expired or invalid token');
          localStorage.removeItem('clicksansar_token');
          localStorage.removeItem('clicksansar_user');
          setUser(null);
          setToken('');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.token) {
      localStorage.setItem('clicksansar_token', res.token);
      localStorage.setItem('clicksansar_user', JSON.stringify(res));
      setToken(res.token);
      setUser(res);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res?.token) {
      localStorage.setItem('clicksansar_token', res.token);
      localStorage.setItem('clicksansar_user', JSON.stringify(res));
      setToken(res.token);
      setUser(res);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('clicksansar_token');
    localStorage.removeItem('clicksansar_user');
    setToken('');
    setUser(null);
  };

  const updateProfile = async (data) => {
    if (!token) throw new Error('Not authenticated');
    const updated = await updateUserProfile(data, token);
    setUser((prev) => ({ ...prev, ...updated }));
    localStorage.setItem('clicksansar_user', JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
