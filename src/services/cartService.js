
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

    // Get book details
    const bookIds = cartItems.map(item => item.book_id);
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, price, image_url')
      .in('id', bookIds);

    if (booksError) throw booksError;

    // Combine cart items with book details
    return cartItems.map(cartItem => {
      const book = books.find(b => b.id === cartItem.book_id);
      if (!book) return null;
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

    // First verify the book exists
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      throw new Error('Book not found');
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        book_id: bookId,
        quantity: 1
      });

    if (error) throw error;
  },

  async updateQuantity(userId, bookId, quantity) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');
    if (quantity < 0) throw new Error('Quantity must be positive');

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        book_id: bookId,
        quantity
      });

    if (error) throw error;
  },

  async removeItem(userId, bookId) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) throw error;
  },

  async clearCart(userId) {
    if (!userId) throw new Error('User ID is required');

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};
