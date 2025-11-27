import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import { socketService } from '../services/socket';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          socketService.connect(savedToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: newUser } = response.data.data;

      // Persist auth data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update state
      setToken(() => newToken);
      setUser(() => newUser);
      
      // Connect socket
      socketService.connect(newToken);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      await authAPI.register(email, password, name);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    // Cleanup
    socketService.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Force page reload for clean state
    window.location.reload();
  }, []);

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!(token && user)
  };
};
