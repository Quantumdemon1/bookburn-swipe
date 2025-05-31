import { supabase, safeOperation, queueSync, getDB, isOffline } from '../lib/db';

export const api = {
  // User operations
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
  getBooks: async () => {
    const db = await getDB();
    if (isOffline()) {
      return db.getAll('books');
    }
    
    const { data, error } = await supabase
      .from('books')
      .select('*');
    
    if (error) throw error;
    
    // Cache books locally
    const tx = db.transaction('books', 'readwrite');
    await Promise.all([
      ...data.map(book => tx.store.put(book)),
      tx.done
    ]);
    
    return data;
  },

  addBook: async (bookData) => {
    const operation = async () => {
      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local cache
      const db = await getDB();
      await db.put('books', data);
      
      return data;
    };

    if (isOffline()) {
      const db = await getDB();
      const tempId = `temp_${Date.now()}`;
      const tempBook = { ...bookData, id: tempId };
      await db.put('books', tempBook);
      await queueSync({
        type: 'insert',
        table: 'books',
        data: bookData
      });
      return tempBook;
    }

    return safeOperation(operation);
  },

  // Review operations
  getReviews: async (bookId) => {
    const db = await getDB();
    if (isOffline()) {
      const reviews = await db.getAll('reviews');
      return reviews.filter(review => review.bookId === bookId);
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(name, avatar_url),
        comments(
          *,
          user:users(name, avatar_url)
        )
      `)
      .eq('book_id', bookId);
    
    if (error) throw error;
    
    // Cache reviews locally
    const tx = db.transaction('reviews', 'readwrite');
    await Promise.all([
      ...data.map(review => tx.store.put(review)),
      tx.done
    ]);
    
    return data;
  },

  addReview: async (reviewData) => {
    const operation = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local cache
      const db = await getDB();
      await db.put('reviews', data);
      
      return data;
    };

    if (isOffline()) {
      const db = await getDB();
      const tempId = `temp_${Date.now()}`;
      const tempReview = { ...reviewData, id: tempId };
      await db.put('reviews', tempReview);
      await queueSync({
        type: 'insert',
        table: 'reviews',
        data: reviewData
      });
      return tempReview;
    }

    return safeOperation(operation);
  },

  // User preferences operations
  getUserPreferences: async (userId) => {
    const db = await getDB();
    if (isOffline()) {
      return db.get('userPreferences', userId);
    }
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      // Cache preferences locally
      await db.put('userPreferences', data);
    }
    
    return data;
  },

  updateUserPreferences: async (userId, preferences) => {
    const operation = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local cache
      const db = await getDB();
      await db.put('userPreferences', data);
      
      return data;
    };

    if (isOffline()) {
      const db = await getDB();
      const prefs = { user_id: userId, ...preferences };
      await db.put('userPreferences', prefs);
      await queueSync({
        type: 'update',
        table: 'user_preferences',
        data: prefs
      });
      return prefs;
    }

    return safeOperation(operation);
  }
};