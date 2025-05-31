import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";
import { initializeUserPreferences } from '@/utils/preferencesManager';
import { updateUserPreferences } from '@/utils/interactionWeights';
import { getNextRecommendation } from '@/utils/recommendationEngine';
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { useUser } from '@/contexts/UserContext';

const Match = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const loadInitialBook = async () => {
      try {
        if (!user?.id) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to view book recommendations.",
            variant: "destructive"
          });
          return;
        }

        initializeUserPreferences();
        setIsLoading(true);
        const nextBook = await getNextRecommendation(user.id);
        if (nextBook) {
          setCurrentBook(nextBook);
        } else {
          toast({
            title: "No Books Available",
            description: "Unable to load book recommendations at this time.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading initial book:', error);
        toast({
          title: "Error",
          description: "Failed to load book recommendations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialBook();

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
  }, [user]);

  const handleAction = async (action) => {
    if (!currentBook || isLoading || !user?.id) return;
    
    try {
      setIsLoading(true);
      await updateUserPreferences(currentBook.id, action);
      
      toast({
        title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
        description: `${currentBook.title} by ${currentBook.author}`
      });

      const nextBook = await getNextRecommendation(user.id, currentBook.id);
      if (nextBook) {
        setCurrentBook(nextBook);
      } else {
        toast({
          title: "No More Books",
          description: "No more recommendations available at this time.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} the book`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  if (!user?.id) {
    return (
      <div className="w-full text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600">Please sign in to view book recommendations.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-center mb-6 text-2xl">Match with Books</h1>
      <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto text-xs">
        Discover books through their content. Swipe right if you like what you read, left if it's not your style.
      </p>
      
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
            className="w-full max-w-screen-xl mx-auto"
          >
            <BookCard
              book={currentBook}
              onBurn={() => handleAction('burn')}
              onLike={() => handleAction('like')}
              onFavorite={() => handleAction('favorite')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};