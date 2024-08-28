import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, ThumbsUp } from "lucide-react";

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
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
          <Button variant="ghost" onClick={() => onBurn(book.id)} className="rounded-full p-4">
            <Flame className="h-8 w-8 text-red-500" />
          </Button>
          <Button variant="ghost" onClick={() => onFavorite(book.id)} className="rounded-full p-4">
            <Heart className="h-8 w-8 text-white" />
          </Button>
          <Button variant="ghost" onClick={() => onLike(book.id)} className="rounded-full p-4">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
