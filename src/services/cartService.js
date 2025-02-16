
import { supabase } from '@/lib/supabase';

export const cartService = {
  async getCartItems(userId) {
    if (!userId) throw new Error('User ID is required');

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('book_id, quantity')
      .eq('user_id', userId);

    if (cartError) throw cartError;
    
    if (!cartItems || cartItems.length === 0) {
      return [];
    }

    // Get book details - using array of UUIDs
    const bookIds = cartItems.map(item => item.book_id);
    
    // Using .in() with an array of UUIDs
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, price, image_url')
      .in('id', bookIds);

    if (booksError) {
      console.error('Error fetching books:', booksError);
      throw booksError;
    }

    if (!books) {
      console.warn('No books found for IDs:', bookIds);
      return [];
    }

    // Combine cart items with book details
    return cartItems.map(cartItem => {
      const book = books.find(b => b.id === cartItem.book_id);
      if (!book) {
        console.warn(`Book not found for ID: ${cartItem.book_id}`);
        return null;
      }
      return {
        id: cartItem.book_id,
        title: book.title,
        price: book.price,
        image_url: book.image_url,
        quantity: cartItem.quantity
      };
    }).filter(Boolean); // Remove any null entries
  },

  async addItem(userId, bookId) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');

    // Verify the book exists and is a valid UUID
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single();

    if (bookError) {
      console.error('Error verifying book:', bookError);
      throw new Error('Book not found or invalid ID format');
    }

    if (!book) {
      throw new Error('Book not found');
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          quantity: 1
        },
        {
          onConflict: 'user_id,book_id'
        }
      );

    if (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  async updateQuantity(userId, bookId, quantity) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');
    if (quantity < 0) throw new Error('Quantity must be positive');

    // Verify the book exists first
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      throw new Error('Book not found or invalid ID format');
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          quantity
        },
        {
          onConflict: 'user_id,book_id'
        }
      );

    if (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  async removeItem(userId, bookId) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    if (!userId) throw new Error('User ID is required');

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
