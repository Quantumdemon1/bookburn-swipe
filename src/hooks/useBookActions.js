
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';

export const useBookActions = (book, addToCart) => {
  const { toast } = useToast();
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  const handleAction = async (action, handler) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setRetryAction(null);

    try {
      switch(action) {
        case 'burn':
          setBurnClicked(true);
          await handler();
          setTimeout(() => setBurnClicked(false), 1000);
          break;
        case 'save':
          setSaveClicked(true);
          await handler();
          setTimeout(() => setSaveClicked(false), 1000);
          break;
        case 'like':
          setLikeClicked(true);
          await handler();
          setTimeout(() => setLikeClicked(false), 1000);
          break;
      }
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
    try {
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
