
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
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (login, signup, signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

  const requestVerification = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .insert([
          { user_id: user.id, status: 'pending' }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Verification Requested",
        description: "Your verification request has been submitted.",
      });

      return { success: true, request: data };
    } catch (error) {
      console.error('Verification request error:', error);
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const approveVerification = async (requestId) => {
    if (!isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      const { data: request, error: fetchError } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      // Update user's verification status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_verified: true,
          verification_date: new Date().toISOString()
        })
        .eq('id', request.user_id);

      if (updateError) throw updateError;

      // Update request status
      const { error: requestError } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      return { success: true };
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    }
  };

  const isAdmin = () => user?.user_metadata?.role === 'admin';
  const isAuthenticated = () => !!user;
  const isVerified = () => user?.user_metadata?.is_verified || false;
  const getMemberNumber = () => user?.user_metadata?.member_number || null;

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
