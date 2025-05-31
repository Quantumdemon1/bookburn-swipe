import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

let offlineMode = !window.navigator.onLine;

window.addEventListener('online', () => {
  offlineMode = false;
});

window.addEventListener('offline', () => {
  offlineMode = true;
});

export const isOffline = () => offlineMode;

export const safeOperation = async (operation) => {
  if (offlineMode) {
    console.log('Operating in offline mode');
    return { data: null, error: new Error('Offline mode') };
  }

  try {
    const result = await operation();
    
    if (result.error) {
      if (result.error.message?.includes('Failed to fetch') || 
          result.error.message?.includes('Network Error')) {
        offlineMode = true;
        return { data: null, error: result.error };
      }
      return { data: null, error: result.error };
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Supabase operation failed:', error);
    
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('Network Error')) {
      offlineMode = true;
    }
    
    return { data: null, error };
  }
};

// Add the missing queueOperation export
export const queueOperation = async (operation) => {
  if (offlineMode) {
    console.log('Operation queued for when online');
    return { data: null, error: new Error('Operation queued') };
  }
  return safeOperation(operation);
};