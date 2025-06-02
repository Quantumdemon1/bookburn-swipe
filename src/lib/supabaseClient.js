import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isOffline = () => {
  return !window.navigator.onLine || !supabaseUrl || !supabaseAnonKey;
};

export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const safeOperation = async (operation) => {
  if (isOffline()) {
    console.warn('Operating in offline mode');
    return { data: null, error: new Error('Offline mode') };
  }

  try {
    const result = await operation();
    
    // Handle the case where no rows are found for a single() query
    if (result.error?.message?.includes('JSON object requested, multiple (or no) rows returned')) {
      return { 
        data: null, 
        error: {
          code: 'PGRST116',
          message: 'No data found',
          details: 'The requested resource does not exist'
        }
      };
    }

    // Handle authentication errors
    if (result.error?.message?.includes('Invalid login credentials')) {
      return {
        data: null,
        error: {
          code: 'auth/invalid-credentials',
          message: 'Invalid email or password',
          details: 'Please check your credentials and try again'
        }
      };
    }

    return result;
  } catch (error) {
    // If it's already a structured Supabase error, pass it through
    if (error.code || error.statusCode) {
      return { data: null, error };
    }

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