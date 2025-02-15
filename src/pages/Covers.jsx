
import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, searchBooks, getNextRecommendation } from '@/utils/recommendationEngine';
import { updateUserPreferences } from '@/utils/interactionWeights';
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
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
    
    // Simulate network delay for the action
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
    
    // Simulate network delay for search
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
    
    // Simulate network delay for genre change
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
    <div className="max-w-5xl mx-auto p-4">
      {isNewUser && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Welcome to Book Burn!</p>
          <p>Start exploring books by swiping through recommendations or use the search bar to find specific titles.</p>
          <p className="text-sm mt-2">Pro tip: Use arrow keys to navigate (←→ to burn/like, ↑ to favorite)</p>
        </motion.div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <Select onValueChange={handleGenreChange} defaultValue="all">
          <SelectTrigger className="w-[180px] mt-4 md:mt-0">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
              onBurn={() => handleAction(currentBook.id, 'burn')}
              onLike={() => handleAction(currentBook.id, 'like')}
              onFavorite={() => handleAction(currentBook.id, 'favorite')}
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
              const nextBook = getNextRecommendation(currentBook.id);
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

export default Index;
