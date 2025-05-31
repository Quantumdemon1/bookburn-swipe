import { createClient } from '@supabase/supabase-js';
import { openDB } from 'idb';

const supabaseUrl = 'https://rdzcrmdivwreoiwgecxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemNybWRpdndyZW9pd2dlY3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTg2NjEsImV4cCI6MjA1NTI3NDY2MX0.XY4UJarl1lpu62zoJx8P0DwAxetGnr_jwKCTVuBjssI';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Initialize IndexedDB
export const initDB = async () => {
  const db = await openDB('bookBurnDB', 1, {
    upgrade(db) {
      // Create stores for offline data
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('userPreferences')) {
        db.createObjectStore('userPreferences', { keyPath: 'userId' });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { 
          keyPath: 'id',
          autoIncrement: true 
        });
      }
    }
  });
  return db;
};

// Get IndexedDB instance
let dbInstance = null;
export const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};

// Check if we're offline
export const isOffline = () => !navigator.onLine;

// Queue an action for sync
export const queueSync = async (action) => {
  const db = await getDB();
  await db.add('syncQueue', {
    ...action,
    timestamp: Date.now()
  });
};

// Process sync queue
export const processSyncQueue = async () => {
  const db = await getDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  const queue = await store.getAll();

  for (const item of queue) {
    try {
      switch (item.type) {
        case 'insert':
          await supabase.from(item.table).insert(item.data);
          break;
        case 'update':
          await supabase.from(item.table).update(item.data).eq('id', item.data.id);
          break;
        case 'delete':
          await supabase.from(item.table).delete().eq('id', item.data.id);
          break;
      }
      await store.delete(item.id);
    } catch (error) {
      console.error('Sync failed for item:', item, error);
    }
  }
};

// Start sync when online
window.addEventListener('online', () => {
  processSyncQueue().catch(console.error);
});

// Helper function for safe Supabase operations with offline fallback
export const safeOperation = async (operation) => {
  try {
    if (isOffline()) {
      throw new Error('Offline');
    }
    const result = await operation();
    return result;
  } catch (error) {
    if (error.message === 'Offline') {
      const db = await getDB();
      // Handle offline operation
      // This will be implemented specifically for each type of operation
      return { data: null, error: 'Offline mode' };
    }
    throw error;
  }
};