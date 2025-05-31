import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility function to safely handle Supabase operations
export const safeOperation = async (operation, fallback = null) => {
  try {
    const result = await operation();
    if (result.error) throw result.error;
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { 
      data: fallback,
      error: {
        message: "Failed to connect to the server. Please check your internet connection and try again.",
        originalError: error
      }
    };
  }
};

// Profile-specific fallback data
export const profileFallback = {
  name: null,
  avatar_url: null,
  bio: null,
  is_verified: false,
  member_number: null,
  reviews_count: 0,
  avg_rating: 0,
  books_read: 0
};