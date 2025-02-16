
import { supabase } from '@/lib/supabase';

export const cartService = {
  async getCartItems(userId) {
    if (!userId) throw new Error('User ID is required');

    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          books (
            id,
            title,
            price,
            image_url
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return cartItems.map(item => ({
        id: item.books.id,
        title: item.books.title,
        price: item.books.price,
        image_url: item.books.image_url,
        quantity: item.quantity
      }));
    } catch (error) {
      console.error('Error in getCartItems:', error);
      throw error;
    }
  },

  async addItem(userId, bookId) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          book_id: bookId,
          quantity: 1
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error in addItem:', error);
      throw error;
    }
  },

  async updateQuantity(userId, bookId, quantity) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');
    if (quantity < 0) throw new Error('Quantity must be positive');

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          book_id: bookId,
          quantity
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      throw error;
    }
  },

  async removeItem(userId, bookId) {
    if (!userId) throw new Error('User ID is required');
    if (!bookId) throw new Error('Book ID is required');

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (error) throw error;
    } catch (error) {
      console.error('Error in removeItem:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    if (!userId) throw new Error('User ID is required');

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }
};
