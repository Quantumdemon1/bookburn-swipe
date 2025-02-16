
import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";
import { initializeUserPreferences } from '@/utils/preferencesManager';
import { updateUserPreferences } from '@/utils/interactionWeights';
import { getNextRecommendation } from '@/utils/recommendationEngine';
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

const Match = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeUserPreferences();
    setIsLoading(true);
    setCurrentBook(getNextRecommendation());
    setIsLoading(false);

    const handleKeyPress = e => {
      if (!currentBook) return;
      switch (e.key) {
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
  }, []);

  const handleAction = action => {
    if (!currentBook) return;
    updateUserPreferences(currentBook.id, action);
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`
    });
    setIsLoading(true);
    const nextBook = getNextRecommendation(currentBook.id);
    setCurrentBook(nextBook);
    setIsLoading(false);
  };

  const handleDragEnd = (_, info) => {
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

  return <div className="w-full">
      <h1 className="font-bold text-center mb-6 text-2xl">Match with Books</h1>
      <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto text-xs">
        Discover books through their content. Swipe right if you like what you read, left if it's not your style.
      </p>
      
      <AnimatePresence mode="wait">
        {isLoading ? <motion.div key="loader" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin" />
          </motion.div> : currentBook && <motion.div key={currentBook.id} initial={{
        opacity: 0,
        x: 200
      }} animate={{
        opacity: 1,
        x: 0,
        rotate: dragDirection * 5
      }} exit={{
        opacity: 0,
        x: -200
      }} drag="x" dragConstraints={{
        left: 0,
        right: 0
      }} onDragEnd={handleDragEnd} onDrag={(_, info) => {
        setDragDirection(info.offset.x > 0 ? 1 : -1);
      }} className="w-full max-w-screen-xl mx-auto">
            <BookCard book={currentBook} onBurn={() => handleAction('burn')} onLike={() => handleAction('like')} onFavorite={() => handleAction('favorite')} />
          </motion.div>}
      </AnimatePresence>
    </div>;
};

export default Match;
