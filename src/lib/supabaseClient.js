import { createClient } from '@supabase/supabase-js';
import localforage from 'localforage';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

// Initialize localforage for offline storage
const offlineStore = localforage.createInstance({
  name: 'bookBurnOffline'
});

// Create Supabase client with enhanced fetch handling
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

// Offline mode state
let offlineMode = !window.navigator.onLine;

// Network status listeners
window.addEventListener('online', () => {
  console.log('App is online');
  offlineMode = false;
  processSyncQueue().catch(console.error);
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  offlineMode = true;
});

// Check if we're offline
export const isOffline = () => offlineMode;

// Queue operations for later sync
export const queueOperation = async (operation) => {
  const queue = await offlineStore.getItem('syncQueue') || [];
  queue.push({
    ...operation,
    timestamp: Date.now()
  });
  await offlineStore.setItem('syncQueue', queue);
};

// Process queued operations when back online
export const processSyncQueue = async () => {
  if (offlineMode) return;

  const queue = await offlineStore.getItem('syncQueue') || [];
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

  await offlineStore.setItem('syncQueue', []);
};

// Safe operation wrapper with offline support
export const safeOperation = async (operation) => {
  try {
    if (offlineMode) {
      console.log('Operating in offline mode');
      return { data: null, error: new Error('Offline mode') };
    }

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
    console.error('Operation failed:', error);
    
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('Network Error')) {
      offlineMode = true;
    }
    
    return { data: null, error };
  }
};

// Clear offline data
export const clearOfflineData = async () => {
  await offlineStore.clear();
};