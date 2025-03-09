import React, { createContext, useContext, useState, useEffect } from 'react';
import APIService from '../server';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = async () => {
      if (APIService.isAuthenticated()) {
        try {
          // Get user profile
          const userData = await APIService.getUserProfile();
          if (userData && userData.user) {
            setUser(userData.user);
            
            // Initialize socket connection
            const userId = APIService.getUserId(userData.user);
            if (userId) {
              APIService.initializeSocket(userId);
            } else {
              console.error("User has no ID:", userData.user);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If there's an error, log the user out
          APIService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
    
    // Clean up socket connection on unmount
    return () => {
      APIService.disconnectSocket();
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await APIService.login(credentials);
      if (response.user) {
        setUser(response.user);
        
        // Initialize socket connection
        const userId = APIService.getUserId(response.user);
        if (userId) {
          APIService.initializeSocket(userId);
        } else {
          console.error("User has no ID:", response.user);
        }
      }
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await APIService.register(userData);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    APIService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return APIService.isAuthenticated();
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 