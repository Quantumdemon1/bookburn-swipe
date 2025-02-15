
import React from 'react';
import { motion } from "framer-motion";

const WelcomeBanner = () => {
  return (
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
  );
};

export default WelcomeBanner;
