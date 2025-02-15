
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, searchBooks, getNextRecommendation } from '@/utils/recommendationEngine';
import { updateUserPreferences } from '@/utils/interactionWeights';
import WelcomeMessage from '@/components/covers/WelcomeMessage';
import FilterSection from '@/components/covers/FilterSection';
import BookDisplay from '@/components/covers/BookDisplay';
import NextButton from '@/components/covers/NextButton';

const Covers = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isNewUser, setIsNewUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const { toast } = useToast();
  const { ref } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (!isSearching) {
      setIsLoading(true);
      const fetchBooks = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const initialBooks = getRecommendations(1, 1, selectedGenre);
        if (initialBooks.length > 0) {
          setCurrentBook(initialBooks[0]);
        }
        setIsLoading(false);
      };
      fetchBooks();
    }
  }, [isSearching, selectedGenre]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsNewUser(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      setIsNewUser(false);
    }

    const handleKeyPress = (e) => {
      if (!currentBook || isActionLoading) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleAction(currentBook.id, 'burn');
          break;
        case 'ArrowRight':
          handleAction(currentBook.id, 'like');
          break;
        case 'ArrowUp':
          handleAction(currentBook.id, 'favorite');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentBook, isActionLoading]);

  const handleAction = async (bookId, action) => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    updateUserPreferences(bookId, action);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const nextBook = getNextRecommendation(bookId);
    setCurrentBook(nextBook);
    setIsActionLoading(false);
    
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `Action taken on book ${bookId}`,
    });
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const searchResults = searchBooks(query);
    if (searchResults.length > 0) {
      setCurrentBook(searchResults[0]);
    }
    setIsLoading(false);
  };

  const handleGenreChange = async (genre) => {
    setSelectedGenre(genre);
    setIsSearching(false);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newBooks = getRecommendations(1, 1, genre);
    if (newBooks.length > 0) {
      setCurrentBook(newBooks[0]);
    }
    setIsLoading(false);
  };

  const handleDragEnd = (_, info) => {
    if (isActionLoading) return;
    
    const offset = info.offset.x;
    if (Math.abs(offset) > 100) {
      if (offset > 0) {
        handleAction(currentBook.id, 'like');
      } else {
        handleAction(currentBook.id, 'burn');
      }
    }
    setDragDirection(0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {isNewUser && <WelcomeMessage />}

      <FilterSection 
        onSearch={handleSearch}
        onGenreChange={handleGenreChange}
      />

      <BookDisplay 
        isLoading={isLoading}
        currentBook={currentBook}
        dragDirection={dragDirection}
        isActionLoading={isActionLoading}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => {
          setDragDirection(info.offset.x > 0 ? 1 : -1);
        }}
        onBurn={() => handleAction(currentBook.id, 'burn')}
        onLike={() => handleAction(currentBook.id, 'like')}
        onFavorite={() => handleAction(currentBook.id, 'favorite')}
      />

      <div ref={ref}>
        <NextButton 
          onClick={() => {
            if (currentBook && !isActionLoading) {
              const nextBook = getNextRecommendation(currentBook.id);
              setCurrentBook(nextBook);
            }
          }}
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
};

export default Covers;
