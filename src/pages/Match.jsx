import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";
import { initializeUserPreferences } from '@/utils/preferencesManager';
import { updateUserPreferences } from '@/utils/interactionWeights';
import { getNextRecommendation } from '@/utils/recommendationEngine';

const Match = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeUserPreferences();
    setCurrentBook(getNextRecommendation());
  }, []);

  const handleAction = (action) => {
    if (!currentBook) return;

    updateUserPreferences(currentBook.id, action);
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`,
    });
    setCurrentBook(getNextRecommendation(currentBook.id));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-xs text-gray-400 mb-4">
        Swipe through book previews and find your next favorite read!
      </p>
      {currentBook && (
        <BookCard
          book={{
            ...currentBook,
            preview: currentBook.preview.slice(0, 200) + (currentBook.preview.length > 200 ? '...' : '')
          }}
          onBurn={() => handleAction('burn')}
          onLike={() => handleAction('like')}
          onFavorite={() => handleAction('favorite')}
        />
      )}
    </div>
  );
};

export default Match;
