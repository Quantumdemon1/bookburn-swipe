
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('currentUser');
      
      if (isAuthenticated && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await api.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => !!user;

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin,
      isAuthenticated,
      setUser // Add this to allow direct user updates
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
