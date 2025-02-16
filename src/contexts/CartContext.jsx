
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '@/contexts/UserContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      // First get cart items
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('book_id, quantity')
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      if (!cartItems || cartItems.length === 0) {
        setCart([]);
        setIsLoading(false);
        return;
      }

      // Then get the book details for each cart item
      const bookIds = cartItems.map(item => item.book_id);
      
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, price, image_url')
        .in('id', bookIds);

      if (booksError) throw booksError;

      // Combine cart items with book details
      const formattedCart = cartItems.map(cartItem => {
        const book = books.find(b => b.id === cartItem.book_id);
        return {
          id: cartItem.book_id,
          title: book?.title,
          price: book?.price,
          image_url: book?.image_url,
          quantity: cartItem.quantity
        };
      });

      setCart(formattedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (book) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add items to cart"
      });
      return;
    }

    try {
      // Add or update item in Supabase
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          book_id: book.id,
          quantity: 1,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;

      // Update local state
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === book.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...book, quantity: 1 }];
      });

      toast({
        title: "Added to Cart",
        description: `${book.title} has been added to your cart`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
    }
  };

  const removeFromCart = async (bookId) => {
    if (!user) return;

    try {
      if (bookId) {
        // Remove specific item
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', bookId);

        if (error) throw error;

        setCart(prevCart => prevCart.filter(item => item.id !== bookId));
      } else {
        // Clear entire cart
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        setCart([]);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(bookId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          quantity,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;

      setCart(prevCart =>
        prevCart.map(item =>
          item.id === bookId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity"
      });
    }
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
