
import { books } from '../data/books';
import type { Book } from '../types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bookService = {
  getBooks: async (): Promise<Book[]> => {
    await delay(300);
    return books;
  },

  getBookById: async (id: number): Promise<Book | undefined> => {
    await delay(200);
    return books.find(book => book.id === id);
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  getFavorites: async (userId: string): Promise<Book[]> => {
    await delay(200);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    return books.filter(book => favorites.includes(book.id));
  },

  toggleFavorite: async (userId: string, bookId: number): Promise<void> => {
    await delay(200);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const index = favorites.indexOf(bookId);
    
    if (index === -1) {
      favorites.push(bookId);
    } else {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  }
};
