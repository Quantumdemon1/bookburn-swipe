import { books } from '../data/books';

// Keep track of shown books
let shownBooks = new Set();

// Initialize user preferences with timestamps
export const initializeUserPreferences = () => {
  const storedPrefs = localStorage.getItem('userPreferences');
  if (storedPrefs) {
    return JSON.parse(storedPrefs);
  }
  
  const preferences = {};
  books.forEach(book => {
    book.tags.forEach(tag => {
      preferences[tag] = {
        weight: 1,
        lastUpdated: Date.now()
      };
    });
  });
  
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
  return preferences;
};

// Calculate time decay
export const calculateTimeDecay = (timestamp) => {
  const now = Date.now();
  const daysDiff = (now - timestamp) / (1000 * 60 * 60 * 24);
  return Math.pow(0.95, daysDiff); // 5% decay per day
};

export const getShownBooks = () => shownBooks;
export const addToShownBooks = (bookId) => shownBooks.add(bookId);
export const clearShownBooks = () => shownBooks.clear();
export const isBookShown = (bookId) => shownBooks.has(bookId);
