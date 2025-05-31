import { api } from '@/services/api';
import { calculateBookScore } from './bookScoring';
import { addToShownBooks, clearShownBooks, getShownBooks } from './preferencesManager';
import { books as initialBooks } from '../data/books';

// Get initial book queue from localStorage or create new one
const getInitialBookQueue = () => {
  const saved = localStorage.getItem('initialBookQueue');
  return saved ? JSON.parse(saved) : initialBooks.map(book => book.id);
};

// Save queue to localStorage
const saveBookQueue = (queue) => {
  localStorage.setItem('initialBookQueue', JSON.stringify(queue));
};

// Get next book from initial queue or recommendations
export const getNextRecommendation = async (userId, currentBookId = null) => {
  try {
    if (!userId) throw new Error('User ID is required');

    // Mark current book as shown if provided
    if (currentBookId) {
      addToShownBooks(currentBookId);
    }

    // Check initial book queue first
    let queue = getInitialBookQueue();
    if (queue.length > 0) {
      const nextBookId = queue[0];
      queue = queue.slice(1);
      saveBookQueue(queue);

      const { data: book } = await api.getBookById(nextBookId);
      if (book) {
        return book;
      }
    }

    // If queue is empty or book not found, proceed with dynamic recommendations
    const { data: preferences } = await api.getUserPreferences(userId);
    const { data: booksData } = await api.getBooks();
    
    const books = Array.isArray(booksData) ? booksData : [];
    if (books.length === 0) return null;

    const availableBooks = books
      .filter(book => !getShownBooks().has(book.id))
      .map(book => ({
        ...book,
        score: calculateBookScore(book, preferences?.preferences || {})
      }))
      .sort((a, b) => b.score - a.score);

    if (availableBooks.length === 0) {
      clearShownBooks();
      return getNextRecommendation(userId);
    }

    return availableBooks[0];
  } catch (error) {
    console.error('Error getting next recommendation:', error);
    throw error;
  }
};

// Get book recommendations based on user preferences and genre filter
export const getRecommendations = async (userId, page = 1, limit = 10, selectedGenre = 'all') => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { data: preferences } = await api.getUserPreferences(userId);
    const { data: booksData } = await api.getBooks({ genre: selectedGenre });
    
    const books = Array.isArray(booksData) ? booksData : [];
    if (books.length === 0) return [];

    let availableBooks = books
      .map(book => ({
        ...book,
        score: calculateBookScore(book, preferences?.preferences || {})
      }))
      .sort((a, b) => b.score - a.score);

    if (availableBooks.length === getShownBooks().size) {
      clearShownBooks();
    }

    return availableBooks.slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Search books
export const searchBooks = async (query) => {
  try {
    const { data: booksData } = await api.getBooks({ searchQuery: query });
    return Array.isArray(booksData) ? booksData : [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};