
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Flame, Heart, ThumbsUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
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
    <Card className="w-full max-w-4xl mx-auto bg-black text-white">
      <CardContent className="p-6">
        <motion.div 
          className="rounded-3xl bg-white text-black p-6 mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img 
            src={book.coverUrl || '/placeholder.svg'} 
            alt={`Cover of ${book.title}`}
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
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-lg mb-4">by {book.author}</p>
            <p className="text-xl">{book.preview}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {book.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBurn}
            className={`rounded-full p-4 flex flex-col items-center transition-all ${burnClicked ? 'animate-burn' : ''}`}
          >
            <div className="text-red-500">
              <Flame size={32} />
              <span className="text-xs block mt-1">BURN</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            onClick={handleSave}
            className={`rounded-full p-4 flex flex-col items-center transition-all ${saveClicked ? 'animate-save' : ''}`}
          >
            <div className="text-pink-500">
              <Heart size={32} />
              <span className="text-xs block mt-1">SAVE</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLike}
            className={`rounded-full p-4 flex flex-col items-center transition-all ${likeClicked ? 'animate-like sparkle' : ''}`}
          >
            <div className="text-blue-500">
              <ThumbsUp size={32} />
              <span className="text-xs block mt-1">LIKE</span>
            </div>
          </Button>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4"
        >
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black animate-add-cart"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
