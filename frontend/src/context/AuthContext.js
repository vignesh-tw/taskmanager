import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app startup
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout(); // Token is invalid, logout user
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      login(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      // Surface more context to help debug the injected.js promise error
      const status = error.response?.status;
      const backendMsg = error.response?.data?.message;
      const normalized = backendMsg || error.message || 'Registration failed';
      console.warn('[register] failed', { status, backendMsg, full: error });
      return {
        success: false,
        error: normalized,
        status
      };
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      // Make sure we're passing the user data correctly to the login function
      login(response.data.data.user);
      return { success: true, data: response.data.data };
    } catch (error) {
      const status = error.response?.status;
      const backendMsg = error.response?.data?.message;
      const normalized = backendMsg || error.message || 'Login failed';
      console.warn('[login] failed', { status, backendMsg, full: error });
      return { success: false, error: normalized, status };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/auth/profile', profileData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    signIn,
    updateProfile,
    isAuthenticated: !!user,
    isTherapist: user?.userType === 'therapist',
    isPatient: user?.userType === 'patient'
  };

  return (
    <AuthContext.Provider value={value}>
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
