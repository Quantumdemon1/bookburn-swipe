import { api } from '@/services/api';
import { calculateBookScore } from './bookScoring';
import { addToShownBooks, clearShownBooks, getShownBooks } from './preferencesManager';

// Get book recommendations based on user preferences and genre filter
export const getRecommendations = async (page = 1, limit = 10, selectedGenre = 'all') => {
  const preferences = await api.getUserPreferences(1); // TODO: Get actual user ID
  
  // Get books from Supabase
  const { data: books } = await api.getBooks({ genre: selectedGenre });
  if (!books) return [];

  // Filter and score books
  let availableBooks = books
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences?.data?.preferences || {})
    }))
    .sort((a, b) => b.score - a.score);

  // If all books have been shown, reset
  if (availableBooks.length === getShownBooks().size) {
    clearShownBooks();
  }

  return availableBooks.slice((page - 1) * limit, page * limit);
};

// Get next recommended book
export const getNextRecommendation = async (currentBookId) => {
  // Mark current book as shown
  if (currentBookId) {
    addToShownBooks(currentBookId);
  }

  const preferences = await api.getUserPreferences(1); // TODO: Get actual user ID
  
  // Get all books from Supabase
  const { data: books } = await api.getBooks();
  if (!books) return null;

  // Get all unshown books and score them
  const availableBooks = books
    .filter(book => !getShownBooks().has(book.id))
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences?.data?.preferences || {})
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
export const searchBooks = async (query) => {
  const { data: books } = await api.getBooks({ searchQuery: query });
  return books || [];
};