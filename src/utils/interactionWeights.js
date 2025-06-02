import { books } from '../data/books';
import { initializeUserPreferences, calculateTimeDecay, addToShownBooks, getShownBooks, clearShownBooks } from './preferencesManager';
import { supabase, safeOperation } from '@/lib/supabaseClient';

// Interaction weights for different actions
export const interactionWeights = {
  like: 1.0,
  burn: -1.0,
  favorite: 2.0,
  rate: 0.5
};

// Update user preferences based on action
export const updateUserPreferences = async (userId, bookId, action, value = 1) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid user ID is required');
  }

  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const preferences = initializeUserPreferences();
  const weight = action === 'rate' ? interactionWeights[action] * value : interactionWeights[action] || 0;
  const now = Date.now();

  // Update tag weights with time decay
  book.tags.forEach(tag => {
    const currentPref = preferences[tag] || { weight: 1, lastUpdated: now };
    const timeDecay = calculateTimeDecay(currentPref.lastUpdated);
    
    preferences[tag] = {
      weight: Math.max(0, Math.min(2, currentPref.weight * timeDecay + weight)),
      lastUpdated: now
    };
  });

  try {
    // Update preferences in Supabase
    const { error: preferencesError } = await safeOperation(() =>
      supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString()
        })
    );

    if (preferencesError) throw preferencesError;

    // Store interaction in Supabase
    const { error: interactionError } = await safeOperation(() =>
      supabase
        .from('book_interactions')
        .insert({
          user_id: userId,
          book_id: bookId,
          action,
          created_at: new Date().toISOString()
        })
    );

    if (interactionError) throw interactionError;

    // Store interaction locally for offline support
    const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    interactions.push({
      bookId,
      action,
      value,
      timestamp: now
    });
    localStorage.setItem('userInteractions', JSON.stringify(interactions));

    // Add to shown books
    addToShownBooks(bookId);
    if (getShownBooks().size === books.length) {
      clearShownBooks();
    }

    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error updating preferences:', error);
    // Store failed operation for later sync
    const pendingOperations = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    pendingOperations.push({
      type: 'updatePreferences',
      data: {
        userId,
        bookId,
        action,
        value,
        preferences,
        timestamp: now
      }
    });
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
  }
};

// Sync pending operations when online
export const syncPendingOperations = async (userId) => {
  if (!userId) return;

  const pendingOperations = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
  if (pendingOperations.length === 0) return;

  const failedOperations = [];

  for (const operation of pendingOperations) {
    try {
      if (operation.type === 'updatePreferences') {
        await updateUserPreferences(
          userId,
          operation.data.bookId,
          operation.data.action,
          operation.data.value
        );
      }
    } catch (error) {
      console.error('Failed to sync operation:', error);
      failedOperations.push(operation);
    }
  }

  localStorage.setItem('pendingOperations', JSON.stringify(failedOperations));
};