import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/endpoints';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setAdmin(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setAdmin(res.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      setToken(null);
      if (error.response?.status === 401) {
         toast.addToast('Session expired. Please log in again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setAdmin(res.data.admin);
        toast.addToast('Logged in successfully', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed';
      toast.addToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    toast.addToast('Logged out', 'info');
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
