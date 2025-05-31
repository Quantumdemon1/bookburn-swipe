import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

let offlineMode = false;

export const isOfflineMode = () => {
  return !window.navigator.onLine || offlineMode;
};

export const setOfflineMode = (isOffline: boolean) => {
  offlineMode = isOffline;
};

export const safeSupabaseOperation = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T | null = null
): Promise<T | null> => {
  try {
    if (isOfflineMode()) {
      console.log('Operating in offline mode, returning fallback data');
      return fallbackData;
    }
    
    const result = await operation();
    
    if (result.error) {
      if (result.error.message?.includes('Failed to fetch') || 
          result.error.message?.includes('Network Error')) {
        setOfflineMode(true);
        return fallbackData;
      }
      throw result.error;
    }
    
    setOfflineMode(false);
    return result.data;
  } catch (error) {
    console.error('Supabase operation failed:', error);
    
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('Network Error')) {
      setOfflineMode(true);
    }
    
    return fallbackData;
  }
};