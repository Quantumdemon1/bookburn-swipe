
import React from 'react';
import { motion } from "framer-motion";

const WelcomeMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded-r"
      role="alert"
    >
      <p className="font-bold">Welcome to Book Burn!</p>
      <p className="hidden md:block">Start exploring books by swiping through recommendations or use the search bar to find specific titles.</p>
      <p className="md:hidden">Start exploring books by swiping through recommendations!</p>
      <p className="text-sm mt-2 hidden md:block">Pro tip: Use arrow keys to navigate (←→ to burn/like, ↑ to favorite)</p>
    </motion.div>
  );
};

export default WelcomeMessage;
