import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const BookContent = ({
  book
}) => {
  // Early return if book is not provided
  if (!book) {
    return null;
  }

  // Ensure tags is always an array
  const tags = book.tags || [];

  return (
    <motion.div 
      whileHover={{
        scale: 1.02
      }} 
      transition={{
        type: "spring",
        stiffness: 300
      }} 
      className="bg-white text-black p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-[1400px] mx-auto px-[25px] py-[12px] rounded-xl shadow-lg"
    >
      <div className="flex flex-col gap-4 h-full">
        <motion.div 
          initial={{
            opacity: 0
          }} 
          animate={{
            opacity: 1
          }} 
          transition={{
            delay: 0.2
          }} 
          className="flex-1 flex flex-col h-full"
        >
          <div className="flex-grow space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{book.title}</h2>
            <p className="text-lg sm:text-xl text-gray-600">by {book.author}</p>
            <div className="my-8 text-gray-800">
              <p className="text-base sm:text-lg leading-relaxed">{book.preview}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
            {tags.map((tag, index) => (
              <motion.span 
                key={tag} 
                initial={{
                  opacity: 0,
                  scale: 0.8
                }} 
                animate={{
                  opacity: 1,
                  scale: 1
                }} 
                transition={{
                  delay: index * 0.1
                }} 
                className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
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