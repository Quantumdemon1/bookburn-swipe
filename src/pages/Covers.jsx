
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, searchBooks, getNextRecommendation } from '@/utils/recommendationEngine';
import { updateUserPreferences } from '@/utils/interactionWeights';
import WelcomeMessage from '@/components/covers/WelcomeMessage';
import FilterSection from '@/components/covers/FilterSection';
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import BookCover from '@/components/BookCover';

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
  }, []);

  const handleAction = async (action) => {
    if (isActionLoading || !currentBook) return;
    
    setIsActionLoading(true);
    updateUserPreferences(currentBook.id, action);
    
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`,
    });
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const nextBook = getNextRecommendation(currentBook.id);
    setCurrentBook(nextBook);
    setIsActionLoading(false);
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
        handleAction('like');
      } else {
        handleAction('burn');
      }
    }
    setDragDirection(0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {isNewUser && <WelcomeMessage />}

      <h1 className="text-2xl font-bold text-center mb-6">Visual Book Discovery</h1>
      <p className="text-sm text-gray-400 mb-8 text-center max-w-2xl mx-auto">
        Judge books by their covers! Swipe through beautiful book covers and brief summaries to find your next read.
      </p>

      <FilterSection 
        onSearch={handleSearch}
        onGenreChange={handleGenreChange}
      />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Loader className="w-8 h-8 animate-spin" />
            </motion.div>
          ) : currentBook && (
            <motion.div
              key={currentBook.id}
              initial={{ opacity: 0, x: 200 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                rotate: dragDirection * 5 
              }}
              exit={{ opacity: 0, x: -200 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onDrag={(_, info) => {
                setDragDirection(info.offset.x > 0 ? 1 : -1);
              }}
              className="w-full max-w-screen-lg mx-auto"
            >
              <BookCover
                book={{
                  ...currentBook,
                  preview: currentBook.preview.slice(0, 150) + (currentBook.preview.length > 150 ? '...' : '')
                }}
                onBurn={() => handleAction('burn')}
                onLike={() => handleAction('like')}
                onFavorite={() => handleAction('favorite')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Covers;
