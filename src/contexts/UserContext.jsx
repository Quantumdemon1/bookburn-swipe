import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user;
      if (sessionUser) {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser) {
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

  const requestVerification = async () => {
    if (!user) throw new Error('Must be logged in to request verification');

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_verified, member_number')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.is_verified) {
        throw new Error('User is already verified');
      }

      const { data: maxMember, error: maxError } = await supabase
        .from('profiles')
        .select('member_number')
        .order('member_number', { ascending: false })
        .limit(1)
        .single();

      if (maxError && maxError.code !== 'PGRST116') throw maxError;

      const nextMemberNumber = (maxMember?.member_number || 0) + 1;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_verified: true,
          member_number: nextMemberNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          is_verified: true,
          member_number: nextMemberNumber
        }
      }));

      return { memberNumber: nextMemberNumber };
    } catch (error) {
      console.error('Verification request error:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    if (!user) return false;
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
      getMemberNumber,
      requestVerification
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