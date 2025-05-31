import { api } from './api';
import type { Book } from '../types';

export const bookService = {
  getBooks: async (filters = {}): Promise<Book[]> => {
    const { data, error } = await api.getBooks(filters);
    if (error) throw error;
    return data || [];
  },

  getBookById: async (id: number): Promise<Book | undefined> => {
    const { data, error } = await api.getBookById(id);
    if (error) throw error;
    return data;
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const { data, error } = await api.getBooks();
    if (error) throw error;
    
    const lowercaseQuery = query.toLowerCase();
    return (data || []).filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  getFavorites: async (userId: string): Promise<Book[]> => {
    const { data: preferences, error } = await api.getUserPreferences(userId);
    if (error) throw error;
    
    const favoriteIds = preferences?.favorites || [];
    const { data: books } = await api.getBooks();
    return (books || []).filter(book => favoriteIds.includes(book.id));
  },

  toggleFavorite: async (userId: string, bookId: number): Promise<void> => {
    const { data: preferences } = await api.getUserPreferences(userId);
    const favorites = preferences?.favorites || [];
    const index = favorites.indexOf(bookId);
    
    if (index === -1) {
      favorites.push(bookId);
    } else {
      favorites.splice(index, 1);
    }
    
    await api.updateUserPreferences(userId, {
      ...preferences,
      favorites
    });
  }
};