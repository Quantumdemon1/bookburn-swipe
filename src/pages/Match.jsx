import React, { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import BookCard from '@/components/BookCard';
import { useMatching } from '@/hooks/useMatching';

const Match = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { currentBook, isLoading, loadNextMatch, handleAction } = useMatching();
  const [dragDirection, setDragDirection] = React.useState(0);

  useEffect(() => {
    if (user?.id) {
      loadNextMatch();
    }
  }, [user?.id, loadNextMatch]);

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

export default Match;