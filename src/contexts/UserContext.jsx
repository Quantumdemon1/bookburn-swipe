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

  const ensureUserProfile = async (userId, email) => {
    try {
      // First try to get the existing profile
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid PGRST116

      // If no profile exists or there's an error, create one
      if (!existingProfile || selectError) {
        const defaultName = email.split('@')[0];
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({ // Use upsert instead of insert to handle race conditions
            id: userId,
            name: defaultName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      // Don't throw the error here - we want to continue even if profile creation fails
      // The RLS policies will ensure security
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        if (sessionUser.email === 'kellis209@gmail.com') {
          sessionUser.user_metadata = {
            ...sessionUser.user_metadata,
            role: 'admin'
          };
        }
        await ensureUserProfile(sessionUser.id, sessionUser.email);
      }
      setUser(sessionUser ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        if (sessionUser.email === 'kellis209@gmail.com') {
          sessionUser.user_metadata = {
            ...sessionUser.user_metadata,
            role: 'admin'
          };
        }
        await ensureUserProfile(sessionUser.id, sessionUser.email);
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

      await ensureUserProfile(data.user.id, data.user.email);
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
        .maybeSingle(); // Use maybeSingle instead of single

      if (profileError) throw profileError;

      if (profile?.is_verified) {
        throw new Error('User is already verified');
      }

      const { data: maxMember, error: maxError } = await supabase
        .from('profiles')
        .select('member_number')
        .order('member_number', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle instead of single

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