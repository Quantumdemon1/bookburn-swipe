import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

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

  const flameVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 0.5,
        repeat: 3,
        repeatType: "reverse",
      },
    },
  };

  const heartVariants = {
    animate: {
      scale: [1, 1.4, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
      },
    },
  };

  const thumbsUpVariants = {
    animate: {
      rotate: [0, 20, 0],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
      },
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-white">
      <CardContent className="p-6">
        <div className="rounded-3xl bg-white text-black p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg mb-4">by {book.author}</p>
          <p className="text-xl">{book.preview}</p>
          <p className="text-sm text-gray-500 mt-2">Tags: {book.tags.join(', ')}</p>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleBurn} className="rounded-full p-4 flex flex-col items-center">
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={flameVariants}
              animate={burnClicked ? "animate" : ""}
            >
              <path d="M24 4C24 4 28 14 28 20C28 26 22 29 22 35C22 41 24 44 24 44C12 41 4 33 4 22C4 11.6406 12.6406 4 24 4Z" fill="#FF3B30"/>
            </motion.svg>
            <span className="text-xs mt-1 text-red-500">BURN</span>
          </Button>
          <Button variant="ghost" onClick={handleSave} className="rounded-full p-4 flex flex-col items-center">
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={heartVariants}
              animate={saveClicked ? "animate" : ""}
            >
              <path d="M24 41.95L23.1 41.15C18.4 36.85 15 33.65 12.45 30.55C9.9 27.45 8.6 24.4 8.6 21.4C8.6 18.8 9.45 16.65 11.15 14.95C12.85 13.25 15 12.4 17.6 12.4C19.4 12.4 21.05 12.85 22.55 13.75C24.05 14.65 25.1 15.85 25.7 17.35H26.3C26.9 15.85 27.95 14.65 29.45 13.75C30.95 12.85 32.6 12.4 34.4 12.4C37 12.4 39.15 13.25 40.85 14.95C42.55 16.65 43.4 18.8 43.4 21.4C43.4 24.4 42.1 27.45 39.55 30.55C37 33.65 33.6 36.85 28.9 41.15L28 41.95H24Z" fill="#FFFFFF"/>
            </motion.svg>
            <span className="text-xs mt-1 text-white">SAVE</span>
          </Button>
          <Button variant="ghost" onClick={handleLike} className="rounded-full p-4 flex flex-col items-center">
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={thumbsUpVariants}
              animate={likeClicked ? "animate" : ""}
            >
              <path d="M2 42H10V18H2V42ZM46 20C46 18.9 45.1 18 44 18H30.4L32.7 9.3C32.9 8.5 32.7 7.7 32.3 7.3C31.9 6.9 31.4 6.7 30.8 6.7L28.3 7.5L17.2 18H16V42H38C39.1 42 40 41.1 40 40L46 24C46 23.7 46 23.3 46 23V20Z" fill="#5856D6"/>
            </motion.svg>
            <span className="text-xs mt-1 text-indigo-500">LIKE</span>
          </Button>
        </div>
        <Button 
          onClick={() => addToCart(book)} 
          className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
