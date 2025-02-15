import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
const BookContent = ({
  book
}) => {
  return <motion.div whileHover={{
    scale: 1.02
  }} transition={{
    type: "spring",
    stiffness: 300
  }} className="bg-white text-black p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-[1400px] mx-auto px-[25px] py-[12px] rounded-xl">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 h-full">
        <AnimatePresence mode="wait">
          
        </AnimatePresence>
        
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="flex-1 flex flex-col h-full">
          <div className="flex-grow space-y-2 md:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{book.title}</h2>
            <p className="text-base sm:text-lg">by {book.author}</p>
            <p className="text-gray-600 text-sm sm:text-base italic mb-2 mx-[5px] my-[29px] py-[18px] px-0">{book.preview}</p>
          </div>
          
          <div className="flex flex-wrap gap-0.5 mt-auto pt-1 border-t border-gray-50">
            {book.tags.map((tag, index) => <motion.span key={tag} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: index * 0.1
          }} className="text-[6px] px-1 py-0.25 bg-gray-50 text-gray-400 rounded-full tracking-tighter">
                {tag}
              </motion.span>)}
          </div>
        </motion.div>
      </div>
    </motion.div>;
};
export default BookContent;