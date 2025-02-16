
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        // Set admin role for specific email
        if (sessionUser.email === 'kellis209@gmail.com') {
          sessionUser.user_metadata = {
            ...sessionUser.user_metadata,
            role: 'admin'
          };
        }
      }
      setUser(sessionUser ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (login, signup, signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        // Set admin role for specific email
        if (sessionUser.email === 'kellis209@gmail.com') {
          sessionUser.user_metadata = {
            ...sessionUser.user_metadata,
            role: 'admin'
          };
        }
      }
      setUser(sessionUser ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Set admin role for specific email after login
      if (data.user.email === 'kellis209@gmail.com') {
        data.user.user_metadata = {
          ...data.user.user_metadata,
          role: 'admin'
        };
      }

      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isAdmin = () => {
    if (!user) return false;
    // Check for specific email or admin role in metadata
    return user.email === 'kellis209@gmail.com' || user?.user_metadata?.role === 'admin';
  };
  
  const isAuthenticated = () => !!user;
  const isVerified = () => user?.user_metadata?.is_verified || false;
  const getMemberNumber = () => user?.user_metadata?.member_number || null;

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      logout,
      isAdmin,
      isAuthenticated,
      isVerified,
      getMemberNumber
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
