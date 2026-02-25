import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

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

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Optionally verify token with backend
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const userData = {
        id: response.user?.id || response.id,
        email: response.user?.email || response.email,
        name: response.user?.name || response.name || email.split('@')[0],
        firstName: response.user?.firstName || response.firstName,
        lastName: response.user?.lastName || response.lastName,
        isAdmin: response.user?.isAdmin || response.isAdmin || false,
        token: response.token || response.accessToken
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      // Only allow demo login if backend is not available (connection error)
      // Otherwise, reject invalid credentials
      if (error.message && error.message.includes('Backend server')) {
        // Backend not running - allow demo mode for development
        const userData = {
          id: Date.now(),
          email: email,
          name: email.split('@')[0],
          firstName: email.split('@')[0],
          lastName: '',
          isAdmin: email === 'admin@ridersforge.com' || email.includes('admin'),
          token: 'demo-token'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        // Backend is running but credentials are invalid
        throw new Error('Invalid email or password');
      }
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await api.register(email, password, firstName, lastName);
      const userData = {
        id: response.user?.id || response.id,
        email: response.user?.email || response.email,
        name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
        firstName: firstName,
        lastName: lastName,
        isAdmin: false,
        token: response.token || response.accessToken
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration failed:', error);
      
      // If backend is running and returns duplicate email error, reject it
      if (error.message && (
        error.message.includes('already exists') || 
        error.message.includes('User with this email') ||
        error.message.includes('has been signed in') ||
        error.message.includes('duplicate')
      )) {
        throw error; // Re-throw duplicate email errors
      }
      
      // Only allow demo registration if backend is truly unavailable (connection error)
      if (error.message && error.message.includes('Backend server')) {
        // Backend not running - allow demo mode for development
        const userData = {
          id: Date.now(),
          email: email,
          name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
          firstName: firstName,
          lastName: lastName,
          isAdmin: false,
          token: 'demo-token'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      // Re-throw all other errors
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear user-specific cart
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const isAdmin = user?.isAdmin || false;

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
