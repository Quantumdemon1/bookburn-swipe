
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import BookCard from '@/components/BookCard';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import WelcomeBanner from '@/components/books/WelcomeBanner';
import BookControls from '@/components/books/BookControls';
import { useBookActions } from '@/hooks/useBookActions';
import { getRecommendations, searchBooks } from '@/utils/recommendationEngine';

const Covers = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isNewUser, setIsNewUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { ref } = useInView({ threshold: 0 });

  const {
    isActionLoading,
    dragDirection,
    setDragDirection,
    handleAction,
    handleDragEnd
  } = useBookActions(currentBook, setCurrentBook);

  useEffect(() => {
    if (!isSearching) {
      setIsLoading(true);
      const fetchBooks = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
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
          handleAction('burn');
          break;
        case 'ArrowRight':
          handleAction('like');
          break;
        case 'ArrowUp':
          handleAction('favorite');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentBook, isActionLoading, handleAction]);

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
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {isNewUser && <WelcomeBanner />}
      
      <BookControls
        onSearch={handleSearch}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookCardSkeleton />
          </motion.div>
        ) : currentBook ? (
          <motion.div
            key={currentBook.id}
            initial={{ opacity: 0, x: 200 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              rotate: dragDirection * 5 
            }}
            exit={{ opacity: 0, x: -200 }}
            drag={!isActionLoading ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => {
              setDragDirection(info.offset.x > 0 ? 1 : -1);
            }}
          >
            <BookCard
              book={currentBook}
              onBurn={() => handleAction('burn')}
              onLike={() => handleAction('like')}
              onFavorite={() => handleAction('favorite')}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500">No books found. Try adjusting your search or genre filter.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={ref} className="text-center mt-8">
        <Button 
          onClick={() => {
            if (currentBook && !isActionLoading) {
              const nextBook = getRecommendations(currentBook.id)[0];
              setCurrentBook(nextBook);
            }
          }} 
          variant="outline"
          className="hover:scale-105 transition-transform"
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          ) : "Next Book"}
        </Button>
      </div>
    </div>
  );
};

export default Covers;
