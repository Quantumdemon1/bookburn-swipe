import { createClient } from '@supabase/supabase-js';
import { books } from '@/data/books';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

// Detect if we're in a restricted environment
const isOffline = () => {
  return (
    window.location.hostname.includes('webcontainer') ||
    window.location.hostname.includes('stackblitz') ||
    !window.navigator.onLine
  );
};

// Create Supabase client with fallback data handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web/2.48.1'
    }
  }
});

// Safe operation wrapper that handles offline mode and errors
export const safeOperation = async (operation) => {
  if (isOffline()) {
    console.log('Operating in offline mode, returning mock data');
    return { data: books, error: null };
  }

  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    // If network error occurs, switch to offline mode and return mock data
    if (error.message?.includes('Failed to fetch')) {
      console.log('Network error detected, falling back to mock data');
      return { data: books, error: null };
    }
    return { data: null, error };
  }
};

// Queue operations for later sync
export const queueOperation = async (operation) => {
  const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
  queue.push({
    ...operation,
    timestamp: Date.now()
  });
  localStorage.setItem('syncQueue', JSON.stringify(queue));
};

// Process queued operations when back online
export const processSyncQueue = async () => {
  if (isOffline()) return;

  const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
  if (queue.length === 0) return;

  for (const operation of queue) {
    try {
      switch (operation.type) {
        case 'insert':
          await supabase.from(operation.table).insert(operation.data);
          break;
        case 'update':
          await supabase.from(operation.table).update(operation.data).eq('id', operation.data.id);
          break;
        case 'delete':
          await supabase.from(operation.table).delete().eq('id', operation.data.id);
          break;
      }
    } catch (error) {
      console.error('Failed to process operation:', operation, error);
    }
  }

  localStorage.setItem('syncQueue', '[]');
};

// Export offline status checker
export { isOffline };

// Add online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('App is online');
    processSyncQueue().catch(console.error);
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
  });
}