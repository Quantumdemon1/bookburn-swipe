
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

export const useBookActions = (book, addToCart) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  const handleAction = async (action, handler) => {
    if (isLoading || !user) {
      toast({
        title: "Action Failed",
        description: user ? "Please wait..." : "Please login to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setRetryAction(null);

    try {
      // First record the interaction in Supabase
      const { error: dbError } = await supabase
        .from('book_interactions')
        .insert({
          user_id: user.id,
          book_id: book.id,
          action_type: action,
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // Then update the local UI state
      switch(action) {
        case 'burn':
          setBurnClicked(true);
          await handler?.();
          setTimeout(() => setBurnClicked(false), 1000);
          break;
        case 'save':
          setSaveClicked(true);
          await handler?.();
          setTimeout(() => setSaveClicked(false), 1000);
          break;
        case 'like':
          setLikeClicked(true);
          await handler?.();
          setTimeout(() => setLikeClicked(false), 1000);
          break;
      }

      // Update user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preference_data: {
            [action]: {
              [book.id]: true,
              timestamp: new Date().toISOString()
            }
          }
        });

      if (prefError) throw prefError;

    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      setRetryAction({ action, handler });
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
        title: "Action Failed",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to cart in Supabase
      const { error: cartError } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          book_id: book.id,
          quantity: 1,
          created_at: new Date().toISOString()
        });

      if (cartError) throw cartError;

      // Update local cart context
      await addToCart(book);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Added to Cart",
        description: `${book.title} has been added to your cart`,
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
