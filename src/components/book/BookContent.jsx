
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const BookContent = ({ book }) => {
  return (
    <motion.div 
      className="rounded-3xl bg-white text-black p-6 mb-6"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        <motion.img 
          key={book.id}
          src={book.coverUrl || '/placeholder.svg'} 
          alt={book.title}
          className="w-full h-48 object-cover rounded-lg mb-4" // Changed from h-64 to h-48
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
        <p className="text-lg mb-4">by {book.author}</p>
        <p className="text-gray-600">{book.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {book.tags.map((tag, index) => (
            <motion.span 
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm px-3 py-1 bg-gray-100 rounded-full"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookContent;
