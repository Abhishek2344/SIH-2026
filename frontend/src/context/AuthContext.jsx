import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('farmer_token');
    const savedUser = localStorage.getItem('farmer_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token in background
        api.get('/api/auth/me')
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('farmer_user', JSON.stringify(res.data));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (err) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('farmer_token', access_token);
    localStorage.setItem('farmer_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('farmer_token', access_token);
    localStorage.setItem('farmer_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('farmer_token');
    localStorage.removeItem('farmer_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
      localStorage.setItem('farmer_user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  const role = user?.role || null;
  const isFarmer = role === 'farmer';
  const isStaff = role === 'staff';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isFarmer,
        isStaff,
        isAdmin,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
