import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isOffline = () => {
  return !window.navigator.onLine || !supabaseUrl || !supabaseAnonKey;
};

export const safeOperation = async (operation) => {
  if (isOffline()) {
    console.warn('Operating in offline mode');
    return { data: null, error: new Error('Offline mode') };
  }

  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return {
      data: null,
      error: new Error('Failed to connect to the server. Please check your internet connection and try again.')
    };
  }
};

export const profileFallback = {
  name: 'Demo User',
  avatar_url: null,
  bio: 'This is a demo account',
  is_verified: false,
  member_number: null,
  reviews_count: 0,
  avg_rating: 0,
  books_read: 0
};