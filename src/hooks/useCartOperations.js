
import { useCallback } from 'react';
import { cartService } from '@/services/cartService';
import { useToast } from "@/components/ui/use-toast";

export const useCartOperations = (user, setCart) => {
  const { toast } = useToast();

  const loadCart = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for loading cart');
      return [];
    }

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

  const removeFromCart = useCallback(async (bookId) => {
    if (!user?.id || !bookId) return;

    try {
      await cartService.removeItem(user.id, bookId);
      setCart(prevCart => prevCart.filter(item => item.id !== bookId));
      
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
      loadCart(); // Reload the cart to ensure UI is in sync with database
    }
  }, [user, setCart, toast, loadCart]);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    if (!user?.id || !bookId) return;

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
      loadCart(); // Reload cart on error to ensure UI is in sync
    }
  }, [user, setCart, removeFromCart, toast, loadCart]);

  const addToCart = useCallback(async (book) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add items to cart"
      });
      return;
    }

    if (!book?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid book data"
      });
      return;
    }

    try {
      await cartService.addItem(user.id, book.id);
      
      // Update cart state after successful database operation
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
        description: error.message || "Failed to add item to cart"
      });
      loadCart(); // Reload cart on error to ensure UI is in sync
    }
  }, [user, setCart, loadCart, toast]);

  return {
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart
  };
};
