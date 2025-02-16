
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

  const addToCart = useCallback(async (book) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add items to cart"
      });
      return;
    }

    try {
      // First check if the item already exists in the cart
      const currentCart = await loadCart();
      const existingItem = currentCart.find(item => item.id === book.id);
      
      if (existingItem) {
        // If it exists, update the quantity
        await cartService.updateQuantity(user.id, book.id, existingItem.quantity + 1);
      } else {
        // If it's new, add it
        await cartService.addItem(user.id, book.id);
      }
      
      // Update local state
      setCart(prevCart => {
        const existingItemInState = prevCart.find(item => item.id === book.id);
        if (existingItemInState) {
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
  }, [user, setCart, loadCart, toast]);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    if (!user?.id) return;

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
  }, [user, setCart, removeFromCart, toast]);

  const removeFromCart = useCallback(async (bookId) => {
    if (!user?.id) return;

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
