
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { updateUserPreferences } from '@/utils/interactionWeights';
import { getNextRecommendation } from '@/utils/recommendationEngine';

export const useBookActions = (currentBook, setCurrentBook) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const { toast } = useToast();

  const handleAction = async (action) => {
    if (isActionLoading || !currentBook) return;
    
    setIsActionLoading(true);
    updateUserPreferences(currentBook.id, action);
    
    // Simulate network delay for the action
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const nextBook = getNextRecommendation(currentBook.id);
    setCurrentBook(nextBook);
    setIsActionLoading(false);
    
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `Action taken on book ${currentBook.id}`,
    });
  };

  const handleDragEnd = (_, info) => {
    if (isActionLoading) return;
    
    const offset = info.offset.x;
    if (Math.abs(offset) > 100) {
      if (offset > 0) {
        handleAction('like');
      } else {
        handleAction('burn');
      }
    }
    setDragDirection(0);
  };

  return {
    isActionLoading,
    dragDirection,
    setDragDirection,
    handleAction,
    handleDragEnd
  };
};
