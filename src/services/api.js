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
      
      // Return in consistent format with online mode
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
    if (isOffline()) {
      const book = mockBooks.find(book => book.id === id);
      // Return in consistent format with online mode
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
  getComments: async (reviewId) => {
    return safeOperation(() =>
      supabase
        .from('comments')
        .select(`
          *,
          user:profiles!comments_user_id_fkey(name, avatar_url),
          reactions:reactions(*)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })
    );
  },

  addComment: async (reviewId, userId, content, parentId = null) => {
    const comment = {
      review_id: reviewId,
      user_id: userId,
      content,
      parent_id: parentId,
      created_at: new Date().toISOString()
    };

    if (isOffline()) {
      const tempId = `temp_${Date.now()}`;
      await queueOperation({
        type: 'insert',
        table: 'comments',
        data: comment,
        tempId
      });
      return { data: { ...comment, id: tempId }, error: null };
    }

    return safeOperation(() =>
      supabase
        .from('comments')
        .insert(comment)
        .select(`
          *,
          user:profiles!comments_user_id_fkey(name, avatar_url)
        `)
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