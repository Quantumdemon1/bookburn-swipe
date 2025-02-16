
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

  const requestVerification = async () => {
    try {
      const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      if (verificationRequests.some(req => req.userId === user.id)) {
        throw new Error('Verification request already pending');
      }
      
      const request = {
        id: Date.now(),
        userId: user.id,
        status: 'pending',
        timestamp: new Date().toISOString(),
        userEmail: user.email,
        userName: user.name
      };
      
      verificationRequests.push(request);
      localStorage.setItem('verificationRequests', JSON.stringify(verificationRequests));
      return { success: true, request };
    } catch (error) {
      console.error('Verification request error:', error);
      throw error;
    }
  };

  const approveVerification = async (requestId) => {
    if (!isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '[]');
      
      const requestIndex = verificationRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        throw new Error('Request not found');
      }

      const request = verificationRequests[requestIndex];
      const memberNumber = verifiedUsers.length + 1;

      // Update user's verification status
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === request.userId);
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          isVerified: true,
          memberNumber,
          verificationDate: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Update current user if it's the same user
      if (user && user.id === request.userId) {
        const updatedUser = {
          ...user,
          isVerified: true,
          memberNumber,
          verificationDate: new Date().toISOString()
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Update verification request status
      verificationRequests[requestIndex] = {
        ...request,
        status: 'approved',
        memberNumber,
        approvedAt: new Date().toISOString()
      };

      verifiedUsers.push({
        userId: request.userId,
        memberNumber,
        verificationDate: new Date().toISOString()
      });

      localStorage.setItem('verificationRequests', JSON.stringify(verificationRequests));
      localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsers));

      return { success: true, memberNumber };
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => !!user;
  const isVerified = () => user?.isVerified || false;
  const getMemberNumber = () => user?.memberNumber || null;

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin,
      isAuthenticated,
      isVerified,
      getMemberNumber,
      requestVerification,
      approveVerification,
      setUser
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
