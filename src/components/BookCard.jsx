import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Flame } from "lucide-react";

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
        <p className="text-sm text-gray-500 mb-4">by {book.author}</p>
        <div className="mb-4">
          {book.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-gray-700 mb-6">{book.preview}</p>
        <div className="flex justify-between">
          <Button variant="destructive" onClick={onBurn}>
            <Flame className="mr-2 h-4 w-4" /> Burn
          </Button>
          <Button variant="outline" onClick={onFavorite}>
            <Heart className="mr-2 h-4 w-4" /> Favorite
          </Button>
          <Button variant="default" onClick={onLike}>
            <ThumbsUp className="mr-2 h-4 w-4" /> Like
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;