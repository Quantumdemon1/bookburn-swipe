
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import BookCard from '@/components/BookCard';
import BookCardSkeleton from '@/components/BookCardSkeleton';

const BookDisplay = ({ 
  isLoading, 
  currentBook, 
  dragDirection, 
  isActionLoading,
  onDragEnd, 
  onDrag, 
  onBurn, 
  onLike, 
  onFavorite 
}) => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-screen-xl"
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
            onDragEnd={onDragEnd}
            onDrag={onDrag}
            className="w-full max-w-screen-xl"
          >
            <BookCard
              book={currentBook}
              onBurn={onBurn}
              onLike={onLike}
              onFavorite={onFavorite}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-gray-500">No books found. Try adjusting your search or genre filter.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookDisplay;
