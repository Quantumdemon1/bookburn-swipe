import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getNextMatch, recordBookMatch } from '@/utils/matchingAlgorithm';
import { updateUserPreferences } from '@/utils/interactionWeights';
import { useUser } from '@/contexts/UserContext';
import { isValidUUID } from '@/lib/supabaseClient';

export const useMatching = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const loadNextMatch = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get book recommendations",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const nextBook = await getNextMatch(user.id);
      
      if (!nextBook) {
        toast({
          title: "No More Books",
          description: "You've seen all available books! Check back later for more."
        });
        return;
      }

      setCurrentBook(nextBook);
    } catch (error) {
      console.error('Error loading next match:', error);
      toast({
        title: "Error",
        description: "Failed to load next book recommendation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const handleAction = useCallback(async (action) => {
    if (!user?.id || !currentBook) return;

    try {
      setIsLoading(true);

      // Only attempt database operations for valid UUIDs
      if (isValidUUID(user.id)) {
        await Promise.all([
          recordBookMatch(user.id, currentBook.id, currentBook.matchScore, action),
          updateUserPreferences(user.id, currentBook.id, action)
        ]);
      } else {
        // For demo users, just store interactions locally
        const interactions = JSON.parse(localStorage.getItem('demoInteractions') || '[]');
        interactions.push({
          bookId: currentBook.id,
          action,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('demoInteractions', JSON.stringify(interactions));
      }

      await loadNextMatch();
    } catch (error) {
      console.error('Error handling action:', error);
      toast({
        title: "Error",
        description: `Failed to process ${action} action`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentBook, loadNextMatch, toast]);

  return {
    currentBook,
    isLoading,
    loadNextMatch,
    handleAction
  };
};