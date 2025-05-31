import { supabase, safeOperation, queueOperation, isOffline } from '@/lib/supabaseClient';
import { books as mockBooks } from '@/data/books';

export const api = {
  // Auth operations
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          avatar_url: userData.avatar_url
        }
      }
    });
    if (error) throw error;
    return data;
  },

  // Book operations
  getBooks: async (filters = {}) => {
    if (isOffline()) {
      return mockBooks.filter(book => {
        if (filters.genre && filters.genre !== 'all') {
          return book.tags.includes(filters.genre);
        }
        return true;
      });
    }

    let query = supabase.from('books').select('*');
    
    if (filters.genre && filters.genre !== 'all') {
      query = query.contains('tags', [filters.genre]);
    }

    return safeOperation(() => query);
  },

  getBookById: async (id) => {
    if (isOffline()) {
      return mockBooks.find(book => book.id === id);
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
          user:user_id (name, avatar_url),
          comments (
            *,
            user:user_id (name, avatar_url)
          )
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

    if (isOffline()) {
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

  // Comment operations
  addComment: async (reviewId, userId, content, parentId = null) => {
    const comment = {
      review_id: reviewId,
      user_id: userId,
      content,
      parent_id: parentId,
      created_at: new Date().toISOString()
    };

    if (isOffline()) {
      await queueOperation({
        type: 'insert',
        table: 'comments',
        data: comment
      });
      return { data: comment, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('comments')
        .insert(comment)
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

    if (isOffline()) {
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
  },

  // Reaction operations
  addReaction: async (reviewId, commentId, userId, type) => {
    const reaction = {
      user_id: userId,
      type,
      created_at: new Date().toISOString()
    };

    if (commentId) {
      reaction.comment_id = commentId;
    } else {
      reaction.review_id = reviewId;
    }

    if (isOffline()) {
      await queueOperation({
        type: 'insert',
        table: 'reactions',
        data: reaction
      });
      return { data: reaction, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('reactions')
        .insert(reaction)
        .select()
        .single()
    );
  },

  // Book interaction operations
  recordBookInteraction: async (userId, bookId, action) => {
    const interaction = {
      user_id: userId,
      book_id: bookId,
      action,
      created_at: new Date().toISOString()
    };

    if (isOffline()) {
      await queueOperation({
        type: 'insert',
        table: 'book_interactions',
        data: interaction
      });
      return { data: interaction, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('book_interactions')
        .insert(interaction)
        .select()
        .single()
    );
  }
};