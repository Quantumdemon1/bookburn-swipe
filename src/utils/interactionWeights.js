import { books } from '../data/books';
import { initializeUserPreferences, calculateTimeDecay, addToShownBooks, getShownBooks, clearShownBooks } from './preferencesManager';

// Interaction weights for different actions
export const interactionWeights = {
  like: 1.0,
  burn: -1.0,
  favorite: 2.0
};

// Update user preferences based on action
export const updateUserPreferences = (bookId, action) => {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const preferences = initializeUserPreferences();
  const weight = interactionWeights[action] || 0;
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

  // Store interaction
  const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
  interactions.push({
    bookId,
    action,
    timestamp: now
  });
  localStorage.setItem('userInteractions', JSON.stringify(interactions));

  // Add to shown books
  addToShownBooks(bookId);
  if (getShownBooks().size === books.length) {
    clearShownBooks();
  }

  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};
