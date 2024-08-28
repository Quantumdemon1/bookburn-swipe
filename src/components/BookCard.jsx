import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, ThumbsUp, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  const { addToCart } = useCart();
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
          <Button variant="ghost" onClick={() => onBurn(book.id)} className="rounded-full p-4 flex flex-col items-center">
            <Flame className="h-8 w-8 text-red-500" />
            <span className="text-xs mt-1 text-red-500">Burn</span>
          </Button>
          <Button variant="ghost" onClick={() => onFavorite(book.id)} className="rounded-full p-4 flex flex-col items-center">
            <Heart className="h-8 w-8 text-white" />
            <span className="text-xs mt-1 text-white">Save</span>
          </Button>
          <Button variant="ghost" onClick={() => onLike(book.id)} className="rounded-full p-4 flex flex-col items-center">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <span className="text-xs mt-1 text-purple-500">Like</span>
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
