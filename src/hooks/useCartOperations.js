
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
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  }, [user, setCart, toast]);

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
    }
  }, [user, setCart, removeFromCart, toast]);

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
      // Update the cart state optimistically
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === book.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...book, quantity: 1 }];
      });

      // Perform the backend operation based on whether the item exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .single();

      if (existingItem) {
        // If item exists, update its quantity
        await cartService.updateQuantity(user.id, book.id, existingItem.quantity + 1);
      } else {
        // If item doesn't exist, add it
        await cartService.addItem(user.id, book.id);
      }

      toast({
        title: "Added to Cart",
        description: `${book.title} has been added to your cart`
      });
    } catch (error) {
      // Revert the optimistic update on error
      loadCart(); // Reload the cart from the server
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item to cart"
      });
    }
  }, [user, setCart, loadCart, toast]);

  return {
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart
  };
};
