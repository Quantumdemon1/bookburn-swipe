import { supabase, safeOperation, queueOperation, isOffline as isOfflineMode } from '@/lib/supabaseClient';
import { books as mockBooks } from '@/data/books';

export const api = {
  // Book operations
  getBooks: async (filters = {}) => {
    if (isOfflineMode()) {
      let filteredBooks = [...mockBooks];
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.tags || []).some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      if (filters.genre && filters.genre !== 'all') {
        filteredBooks = filteredBooks.filter(book => 
          (book.tags || []).includes(filters.genre)
        );
      }
      
      return { data: filteredBooks, error: null };
    }

    let query = supabase.from('books').select('*');
    
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,author.ilike.%${filters.searchQuery}%`);
    }
    
    if (filters.genre && filters.genre !== 'all') {
      query = query.contains('tags', [filters.genre]);
    }

    return safeOperation(() => query);
  },

  getBookById: async (id) => {
    if (isOfflineMode()) {
      const book = mockBooks.find(book => book.id === id);
      return { data: book || null, error: null };
    }

    return safeOperation(() => 
      supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
    );
  },

  // Review operations
  getReviews: async (bookId) => {
    return safeOperation(() =>
      supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!reviews_user_id_fkey(name, avatar_url),
          comments:comments(
            *,
            user:profiles!comments_user_id_fkey(name, avatar_url),
            reactions:reactions(*)
          ),
          reactions:reactions(*)
        `)
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })
    );
  },

  addReview: async (bookId, userId, content, rating) => {
    const review = {
      book_id: bookId,
      user_id: userId,
      content,
      rating,
      created_at: new Date().toISOString()
    };

    if (isOfflineMode()) {
      await queueOperation({
        type: 'insert',
        table: 'reviews',
        data: review
      });
      return { data: review, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('reviews')
        .insert(review)
        .select()
        .single()
    );
  },

  // User preferences operations
  getUserPreferences: async (userId) => {
    return safeOperation(() =>
      supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
    );
  },

  updateUserPreferences: async (userId, preferences) => {
    const data = {
      user_id: userId,
      preferences,
      updated_at: new Date().toISOString()
    };

    if (isOfflineMode()) {
      await queueOperation({
        type: 'upsert',
        table: 'user_preferences',
        data
      });
      return { data, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('user_preferences')
        .upsert(data)
        .select()
        .single()
    );
  }
};