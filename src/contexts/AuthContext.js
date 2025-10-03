'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { login, register, getMe, logout, isAuthenticated, getToken } from '@/strapi/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        if (isAuthenticated()) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error.message);
        // Clear invalid token
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await login(identifier, password);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await register(username, email, password);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError(null);
    logout();
  };

  const refreshUser = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await getMe();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setError(error.message);
      handleLogout();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    token: getToken(),
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
