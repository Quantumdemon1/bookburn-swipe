
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const BookContent = ({ book }) => {
  return (
    <motion.div 
      className="rounded-3xl bg-white text-black p-4 sm:p-6 mb-4 sm:mb-6"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <AnimatePresence mode="wait">
          <motion.div 
            className="relative w-full md:w-2/5"
          >
            <div className="aspect-[3/4] md:aspect-[4/3] relative">
              <motion.img 
                key={book.id}
                src={book.coverUrl || '/placeholder.svg'} 
                alt={book.title}
                className="w-full h-full object-cover rounded-lg absolute inset-0"
                srcSet={`${book.coverUrl || '/placeholder.svg'} 300w,
                        ${book.coverUrl || '/placeholder.svg'} 600w,
                        ${book.coverUrl || '/placeholder.svg'} 900w`}
                sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 50vw,
                       40vw"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 space-y-3 md:space-y-6 md:py-4"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{book.title}</h2>
          <p className="text-base sm:text-lg md:text-xl">by {book.author}</p>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg line-clamp-3 md:line-clamp-none">{book.description}</p>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-4">
            {book.tags.map((tag, index) => (
              <motion.span 
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 bg-gray-100 rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookContent;
