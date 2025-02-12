
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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
          <img 
            src={book.coverUrl || '/placeholder.svg'} 
            alt={`Cover of ${book.title}`}
            className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-100"
          />
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg mb-4">by {book.author}</p>
          <p className="text-xl">{book.preview}</p>
          <p className="text-sm text-gray-500 mt-2">Tags: {book.tags.join(', ')}</p>
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBurn}
            className={`rounded-full p-4 flex flex-col items-center transition-transform ${burnClicked ? 'animate-burn' : ''}`}
          >
            <span className="text-4xl mb-1">🔥</span>
            <span className="text-xs text-red-500">BURN</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleSave}
            className={`rounded-full p-4 flex flex-col items-center transition-transform ${saveClicked ? 'animate-save' : ''}`}
          >
            <span className="text-4xl mb-1">❤️</span>
            <span className="text-xs text-white">SAVE</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLike}
            className={`rounded-full p-4 flex flex-col items-center transition-transform ${likeClicked ? 'animate-like' : ''}`}
          >
            <span className="text-4xl mb-1">👍</span>
            <span className="text-xs text-indigo-500">LIKE</span>
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
