
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import { supabase, isOfflineMode, safeSupabaseOperation, setOfflineMode } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { handleError } from '@/lib/errorHandler';

export const useBookActions = (book, addToCart) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  // Check network status on mount and when window comes online/offline
  useEffect(() => {
    const handleNetworkChange = () => {
      setOfflineMode(!window.navigator.onLine);
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Initial check
    handleNetworkChange();

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  // Simple local storage helper for offline mode
  const updateLocalActionHistory = (actionType, bookId) => {
    try {
      const key = `book_${actionType}_${user?.id || 'anonymous'}`;
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing[bookId] = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error updating local action history:', error);
    }
  };

  const handleAction = async (action, handler) => {
    if (isLoading) {
      toast({
        title: "Please Wait",
        description: "Another action is in progress...",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setRetryAction(null);

    try {
      // Update the local UI state immediately for better UX
      switch(action) {
        case 'burn':
          setBurnClicked(true);
          break;
        case 'save':
          setSaveClicked(true);
          break;
        case 'like':
          setLikeClicked(true);
          break;
      }

      // Store action in local storage for offline support
      updateLocalActionHistory(action, book.id);
      
      // Try to sync with Supabase if we're online
      if (!isOfflineMode()) {
        // Check if books table has the book
        const existingBook = await safeSupabaseOperation(
          () => supabase.from('books').select('id').eq('id', book.id).single()
        );
        
        // If book doesn't exist in DB, insert it
        if (!existingBook || existingBook.length === 0) {
          await safeSupabaseOperation(
            () => supabase.from('books').insert({
              id: book.id,
              title: book.title,
              price: book.price || 9.99,
              image_url: book.image_url || book.cover_url
            })
          );
        }
  
        // Record the interaction in Supabase
        await safeSupabaseOperation(
          () => supabase.from('book_interactions').insert({
            user_id: user.id,
            book_id: book.id,
            action_type: action,
            created_at: new Date().toISOString()
          })
        );
      }

      // Execute any additional handler
      if (handler) await handler();
      
      // Reset UI state after a delay
      setTimeout(() => {
        switch(action) {
          case 'burn':
            setBurnClicked(false);
            break;
          case 'save':
            setSaveClicked(false);
            break;
          case 'like':
            setLikeClicked(false);
            break;
        }
      }, 1000);

      // Show success toast
      toast({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Successful`,
        description: `You have ${action}ed "${book.title}"${isOfflineMode() ? ' (offline mode)' : ''}`,
      });

    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      setRetryAction({ action, handler });
      
      // Reset UI state if there was an error
      switch(action) {
        case 'burn':
          setBurnClicked(false);
          break;
        case 'save':
          setSaveClicked(false);
          break;
        case 'like':
          setLikeClicked(false);
          break;
      }
      
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to ${action} the book. Click to try again.`,
        action: (
          <Button 
            variant="outline" 
            onClick={() => handleAction(action, handler)}
            className="bg-white text-red-500 hover:bg-red-50"
          >
            Retry
          </Button>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) {
      toast({
        title: "Please Wait",
        description: "Already processing an action",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Store cart action in local storage for offline support
      updateLocalActionHistory('cart', book.id);
      
      // Run confetti effect immediately for better UX
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Try to sync with Supabase if online
      if (!isOfflineMode()) {
        // Check if book exists in database, add if not
        const existingBook = await safeSupabaseOperation(
          () => supabase.from('books').select('id').eq('id', book.id).single()
        );
        
        if (!existingBook || existingBook.length === 0) {
          await safeSupabaseOperation(
            () => supabase.from('books').insert({
              id: book.id,
              title: book.title,
              price: book.price || 9.99,
              image_url: book.image_url || book.cover_url
            })
          );
        }
        
        // Add to cart in Supabase
        await safeSupabaseOperation(
          () => supabase.from('cart_items').upsert({
            user_id: user.id,
            book_id: book.id,
            quantity: 1
          }, {
            onConflict: 'user_id,book_id'
          })
        );
      }

      // Update local cart context
      await addToCart(book);
      
      toast({
        title: "Added to Cart",
        description: `${book.title} has been added to your cart${isOfflineMode() ? ' (offline mode)' : ''}`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Failed to Add to Cart",
        description: "Please try again",
        action: (
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            className="bg-white text-red-500 hover:bg-red-50"
          >
            Retry
          </Button>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    burnClicked,
    saveClicked,
    likeClicked,
    isLoading,
    retryAction,
    handleAction,
    handleAddToCart
  };
};
