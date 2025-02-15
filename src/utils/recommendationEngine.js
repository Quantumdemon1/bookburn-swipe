
import { books } from '../data/books';
import { initializeUserPreferences } from './preferencesManager';
import { calculateBookScore } from './bookScoring';
import { addToShownBooks, clearShownBooks, getShownBooks } from './preferencesManager';

// Get book recommendations based on user preferences and genre filter
export const getRecommendations = (page = 1, limit = 10, selectedGenre = 'all') => {
  const preferences = initializeUserPreferences();
  
  // Filter and score books
  let availableBooks = books
    .filter(book => selectedGenre === 'all' || book.tags.includes(selectedGenre))
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences)
    }))
    .sort((a, b) => b.score - a.score);

  // If all books have been shown, reset
  if (availableBooks.length === getShownBooks().size) {
    clearShownBooks();
  }

  return availableBooks.slice((page - 1) * limit, page * limit);
};

// Get next recommended book
export const getNextRecommendation = (currentBookId) => {
  // Mark current book as shown
  if (currentBookId) {
    addToShownBooks(currentBookId);
  }

  const preferences = initializeUserPreferences();
  
  // Get all unshown books and score them
  const availableBooks = books
    .filter(book => !getShownBooks().has(book.id))
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences)
    }))
    .sort((a, b) => b.score - a.score);

  // If no more unshown books, reset and try again
  if (availableBooks.length === 0) {
    clearShownBooks();
    return getNextRecommendation();
  }

  return availableBooks[0];
};

// Search books
export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
