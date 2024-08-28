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
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={burnClicked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <path d="M16 2C16 2 18 8 18 12C18 16 14 18 14 22C14 26 16 30 16 30C8 28 2 22 2 14C2 7.37258 7.37258 2 16 2Z" fill="#FF0000" />
            </motion.svg>
            <span className="text-xs mt-1 text-red-500">Burn</span>
          </Button>
          <Button variant="ghost" onClick={handleSave} className="rounded-full p-4 flex flex-col items-center">
            <motion.svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={saveClicked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <path d="M16 28L28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span className="text-xs mt-1 text-white">Save</span>
          </Button>
          <Button variant="ghost" onClick={handleLike} className="rounded-full p-4 flex flex-col items-center">
            <motion.svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={likeClicked ? { rotate: [0, 20, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <path d="M8 14V28H2V14H8ZM30 14C30 12.9 29.1 12 28 12H20.4L21.7 7.3C21.9 6.5 21.7 5.7 21.3 5.3C20.9 4.9 20.4 4.7 19.8 4.7L18.3 5.5L11.2 14H10V28H24C25.1 28 26 27.1 26 26L30 16C30 15.7 30 15.3 30 15V14Z" fill="#0000FF" />
            </motion.svg>
            <span className="text-xs mt-1 text-blue-500">Like</span>
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
