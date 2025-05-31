import { createClient } from '@supabase/supabase-js';
import localforage from 'localforage';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

// Initialize localforage instances for different stores
const offlineStore = localforage.createInstance({
  name: 'bookBurnOffline',
  storeName: 'offlineActions'
});

const cacheStore = localforage.createInstance({
  name: 'bookBurnCache',
  storeName: 'dataCache'
});

// Create Supabase client with custom fetch handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'bookburn' },
    fetch: async (...args) => {
      try {
        const response = await fetch(...args);
        if (!response.ok) {
          // Return a proper Response object for non-OK responses
          return new Response(JSON.stringify({
            error: `HTTP error! status: ${response.status}`
          }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return response;
      } catch (error) {
        // Try to handle offline operation
        const offlineResponse = await handleOfflineOperation(args[0], args[1]);
        if (offlineResponse) {
          return offlineResponse;
        }
        
        // Return a proper Response object for network errors
        return new Response(JSON.stringify({
          error: 'Network error or offline'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
});

// Offline state management
let isOfflineMode = !navigator.onLine;
window.addEventListener('online', () => {
  isOfflineMode = false;
  processSyncQueue().catch(console.error);
});
window.addEventListener('offline', () => {
  isOfflineMode = true;
});

// Check if we're offline
export const isOffline = () => isOfflineMode;

// Queue an operation for later sync
export const queueOperation = async (operation) => {
  const timestamp = Date.now();
  const id = `${operation.type}_${timestamp}`;
  await offlineStore.setItem(id, {
    ...operation,
    timestamp,
    status: 'pending'
  });
};

// Process the sync queue when we're back online
export const processSyncQueue = async () => {
  if (isOffline()) return;

  const keys = await offlineStore.keys();
  
  for (const key of keys) {
    try {
      const operation = await offlineStore.getItem(key);
      if (operation.status !== 'pending') continue;

      const { type, table, data } = operation;
      
      switch (type) {
        case 'insert':
          await supabase.from(table).insert(data);
          break;
        case 'update':
          await supabase.from(table).update(data).eq('id', data.id);
          break;
        case 'delete':
          await supabase.from(table).delete().eq('id', data.id);
          break;
      }

      await offlineStore.removeItem(key);
    } catch (error) {
      console.error('Failed to process operation:', key, error);
      const operation = await offlineStore.getItem(key);
      await offlineStore.setItem(key, {
        ...operation,
        status: 'failed',
        error: error.message
      });
    }
  }
};

// Handle offline operations
const handleOfflineOperation = async (url, options) => {
  const path = new URL(url).pathname;
  const matches = path.match(/\/rest\/v1\/([^/]+)/);
  if (!matches) return null;

  const table = matches[1];
  const method = options.method || 'GET';
  
  if (method === 'GET') {
    const cachedData = await cacheStore.getItem(`${table}_cache`);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    const data = JSON.parse(options.body || '{}');
    await queueOperation({
      type: method === 'POST' ? 'insert' : method === 'PATCH' ? 'update' : 'delete',
      table,
      data
    });
    
    // Return a success response for offline mutations
    return new Response(JSON.stringify({
      status: 'queued',
      message: 'Operation queued for sync'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return null;
};

// Safe operation wrapper
export const safeOperation = async (operation) => {
  try {
    const result = await operation();
    
    // Handle offline/error responses
    if (result.error) {
      if (result.status === 503) {
        return { data: null, error: 'Offline mode', isOffline: true };
      }
      return { data: null, error: result.error };
    }
    
    // Cache successful GET results
    if (operation.toString().includes('.select(')) {
      const table = operation.toString().match(/from\('([^']+)'\)/)?.[1];
      if (table && result.data) {
        await cacheStore.setItem(`${table}_cache`, result.data);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Operation error:', error);
    return { 
      data: null, 
      error: error.message || 'Operation failed',
      isOffline: isOffline()
    };
  }
};

// Clear offline data
export const clearOfflineData = async () => {
  await offlineStore.clear();
  await cacheStore.clear();
};