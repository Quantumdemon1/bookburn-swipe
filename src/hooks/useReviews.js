import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useUser } from '@/contexts/UserContext';

export const useReviews = (selectedBook) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const { toast } = useToast();
  const { user } = useUser();

  const loadReviews = async () => {
    if (!selectedBook) return;
    setIsLoading(true);
    try {
      const fetchedReviews = await api.getReviews(selectedBook.id);
      const sortedReviews = sortReviews(fetchedReviews || [], sortOrder);
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortReviews = (reviewsToSort, order) => {
    if (!Array.isArray(reviewsToSort)) return [];
    
    return [...reviewsToSort].sort((a, b) => {
      switch (order) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  };

  const handleLike = async (reviewId) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like reviews.",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.toggleLike(reviewId, user.id);
      await loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like review",
        variant: "destructive"
      });
    }
  };

  const handleReaction = async (reviewId, commentId, type) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to react to reviews.",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.addReaction(reviewId, commentId, user.id, type);
      await loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedBook) {
      loadReviews();
    }
  }, [selectedBook, sortOrder]);

  return {
    reviews,
    isLoading,
    sortOrder,
    setSortOrder,
    handleLike,
    handleReaction,
    loadReviews
  };
};