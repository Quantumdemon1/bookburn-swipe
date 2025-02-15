
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Flame, Heart, ThumbsUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  const { addToCart } = useCart();
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);

  const handleBurn = () => {
    setBurnClicked(true);
    setTimeout(() => setBurnClicked(false), 1000);
    onBurn(book.id);
  };

  const handleSave = () => {
    setSaveClicked(true);
    setTimeout(() => setSaveClicked(false), 1000);
    onFavorite(book.id);
  };

  const handleLike = () => {
    setLikeClicked(true);
    setTimeout(() => setLikeClicked(false), 1000);
    onLike(book.id);
  };

  const handleAddToCart = () => {
    addToCart(book);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to book content
      </a>
      
      <Card 
        className="w-full max-w-4xl mx-auto bg-black text-white"
        role="article"
        aria-label={`Book card for ${book.title} by ${book.author}`}
      >
        <CardContent className="p-6">
          <motion.div 
            className="rounded-3xl bg-white text-black p-6 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            id="main-content"
          >
            <motion.img 
              src={book.coverUrl || '/placeholder.svg'} 
              alt={`Book cover for ${book.title}`}
              className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2" tabIndex={0}>{book.title}</h2>
              <p className="text-lg mb-4" tabIndex={0}>by {book.author}</p>
              <p className="text-xl" tabIndex={0}>{book.preview}</p>
              <div 
                className="flex flex-wrap gap-2 mt-2"
                role="list"
                aria-label="Book tags"
              >
                {book.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600"
                    role="listitem"
                    tabIndex={0}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
          <div 
            className="flex justify-between items-center"
            role="group"
            aria-label="Book actions"
          >
            <motion.div>
              <Button
                variant="ghost"
                onClick={handleBurn}
                className="rounded-full p-4 flex flex-col items-center focus:ring-2 focus:ring-red-500 focus:outline-none"
                aria-label={`Burn ${book.title}`}
                aria-pressed={burnClicked}
              >
                <motion.div 
                  className="text-red-500"
                  animate={burnClicked ? {
                    scale: [1, 1.2, 0],
                    rotate: [0, -5, 10],
                    opacity: [1, 1, 0]
                  } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <Flame size={32} aria-hidden="true" />
                  <span className="text-xs block mt-1">BURN</span>
                </motion.div>
              </Button>
            </motion.div>

            <motion.div>
              <Button
                variant="ghost"
                onClick={handleSave}
                className="rounded-full p-4 flex flex-col items-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                aria-label={`Save ${book.title} to favorites`}
                aria-pressed={saveClicked}
              >
                <motion.div 
                  className="text-pink-500"
                  animate={saveClicked ? {
                    scale: [1, 1.4, 0.8, 1.2, 1],
                    rotate: [0, -15, 15, -15, 0]
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Heart size={32} aria-hidden="true" />
                  <span className="text-xs block mt-1">SAVE</span>
                </motion.div>
              </Button>
            </motion.div>

            <motion.div>
              <Button
                variant="ghost"
                onClick={handleLike}
                className="rounded-full p-4 flex flex-col items-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={`Like ${book.title}`}
                aria-pressed={likeClicked}
              >
                <motion.div 
                  className="text-blue-500"
                  animate={likeClicked ? {
                    scale: [1, 1.5, 1],
                    y: [0, -10, 0],
                    color: ['#3B82F6', '#10B981', '#3B82F6'],
                    rotate: [0, 0, 360]
                  } : {}}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }}
                >
                  <ThumbsUp size={32} aria-hidden="true" />
                  <span className="text-xs block mt-1">LIKE</span>
                </motion.div>
              </Button>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button 
              onClick={handleAddToCart} 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              aria-label={`Add ${book.title} to cart`}
            >
              <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
              Add to Cart
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookCard;
