
import { useCallback } from 'react';
import { cartService } from '@/services/cartService';
import { useToast } from "@/components/ui/use-toast";

export const useCartOperations = (user, setCart) => {
  const { toast } = useToast();

  const loadCart = useCallback(async () => {
    try {
      const items = await cartService.getCartItems(user.id);
      setCart(items);
      return items;
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items"
      });
      return [];
    }
  }, [user, setCart, toast]);

  const addToCart = useCallback(async (book) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add items to cart"
      });
      return;
    }

    try {
      await cartService.addItem(user.id, book.id);
      
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
  }, [user, setCart, toast]);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(bookId);
        return;
      }

      await cartService.updateQuantity(user.id, bookId, quantity);
      
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
  }, [user, setCart, toast]);

  const removeFromCart = useCallback(async (bookId) => {
    if (!user) return;

    try {
      if (bookId) {
        await cartService.removeItem(user.id, bookId);
        setCart(prevCart => prevCart.filter(item => item.id !== bookId));
      } else {
        await cartService.clearCart(user.id);
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
  }, [user, setCart, toast]);

  return {
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart
  };
};
