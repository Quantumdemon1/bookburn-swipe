
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
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

  const handleAction = async (action, handler) => {
    if (isLoading) {
      toast({
        title: "Action Failed",
        description: "Please wait...",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Action Failed",
        description: "Please login to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setRetryAction(null);

    try {
      // Check if books table has the book
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id')
        .eq('id', book.id)
        .single();
      
      // If book doesn't exist in DB, insert it
      if (checkError && checkError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('books')
          .insert({
            id: book.id,
            title: book.title,
            price: book.price || 9.99,
            image_url: book.image_url || book.cover_url
          });
          
        if (insertError) throw insertError;
      }

      // Record the interaction in Supabase
      const { error: dbError } = await supabase
        .from('book_interactions')
        .insert({
          user_id: user.id,
          book_id: book.id,
          action_type: action,
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // Update the local UI state
      switch(action) {
        case 'burn':
          setBurnClicked(true);
          if (handler) await handler();
          setTimeout(() => setBurnClicked(false), 1000);
          break;
        case 'save':
          setSaveClicked(true);
          if (handler) await handler();
          setTimeout(() => setSaveClicked(false), 1000);
          break;
        case 'like':
          setLikeClicked(true);
          if (handler) await handler();
          setTimeout(() => setLikeClicked(false), 1000);
          break;
      }

      // Create user_preferences record if it doesn't exist
      const { data: existingPref } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', user.id)
        .single();
      
      // Update user preferences
      if (!existingPref) {
        // Create new preferences record
        const prefData = {};
        prefData[action] = {};
        prefData[action][book.id] = true;
        
        const { error: createPrefError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            preference_data: prefData
          });
        
        if (createPrefError) throw createPrefError;
      } else {
        // Update existing preferences
        const { data: currentPrefs, error: getPrefError } = await supabase
          .from('user_preferences')
          .select('preference_data')
          .eq('user_id', user.id)
          .single();
          
        if (getPrefError) throw getPrefError;
        
        const updatedPrefs = { ...currentPrefs.preference_data };
        if (!updatedPrefs[action]) updatedPrefs[action] = {};
        updatedPrefs[action][book.id] = true;
        updatedPrefs[action].timestamp = new Date().toISOString();
        
        const { error: updatePrefError } = await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', user.id);
          
        if (updatePrefError) throw updatePrefError;
      }

      // Show success toast
      toast({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Successful`,
        description: `You have ${action}ed "${book.title}"`,
      });

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
      // Check if book exists in database, add if not
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id')
        .eq('id', book.id)
        .single();
      
      if (checkError && checkError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('books')
          .insert({
            id: book.id,
            title: book.title,
            price: book.price || 9.99,
            image_url: book.image_url || book.cover_url
          });
          
        if (insertError) throw insertError;
      }
      
      // Add to cart in Supabase
      const { error: cartError } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          book_id: book.id,
          quantity: 1
        }, {
          onConflict: 'user_id,book_id'
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
