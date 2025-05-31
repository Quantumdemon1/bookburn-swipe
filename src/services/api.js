import { supabase, safeOperation, isOffline as isOfflineMode } from '@/lib/supabaseClient';
import { books as mockBooks } from '@/data/books';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (id) => {
  return UUID_REGEX.test(id);
};

const mockUserPreferences = {
  theme: 'light',
  notifications: true,
  language: 'en',
  reading_goals: {
    daily: 30,
    weekly: 5
  }
};

const mockReview = {
  id: 1,
  content: "Great book!",
  rating: 5,
  created_at: new Date().toISOString(),
  user: {
    name: "Demo User",
    avatar_url: null
  },
  likes: 0,
  comments: [],
  reactions: {}
};

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
    if (isOfflineMode()) {
      return { data: [mockReview], error: null };
    }

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

  addReview: async (userId, bookId, reviewData) => {
    if (!isValidUUID(userId) || isOfflineMode()) {
      return {
        data: {
          ...mockReview,
          ...reviewData,
          user_id: userId,
          book_id: bookId
        },
        error: null
      };
    }

    const review = {
      book_id: bookId,
      user_id: userId,
      content: reviewData.content,
      rating: reviewData.rating,
      created_at: new Date().toISOString()
    };

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
    if (!isValidUUID(userId) || isOfflineMode()) {
      return { data: mockUserPreferences, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
    );
  },

  updateUserPreferences: async (userId, preferences) => {
    if (!isValidUUID(userId) || isOfflineMode()) {
      return { data: { ...mockUserPreferences, ...preferences }, error: null };
    }

    const data = {
      user_id: userId,
      preferences,
      updated_at: new Date().toISOString()
    };

    return safeOperation(() =>
      supabase
        .from('user_preferences')
        .upsert(data)
        .select()
        .single()
    );
  },

  // Reaction operations
  toggleLike: async (reviewId, userId) => {
    if (!isValidUUID(userId) || isOfflineMode()) {
      return { data: null, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('reactions')
        .upsert({
          review_id: reviewId,
          user_id: userId,
          type: 'like',
          created_at: new Date().toISOString()
        })
    );
  },

  addReaction: async (reviewId, commentId, userId, type) => {
    if (!isValidUUID(userId) || isOfflineMode()) {
      return { data: null, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('reactions')
        .upsert({
          review_id: reviewId,
          comment_id: commentId,
          user_id: userId,
          type,
          created_at: new Date().toISOString()
        })
    );
  }
};