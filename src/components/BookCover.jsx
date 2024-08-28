import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, ThumbsUp } from "lucide-react";

const BookCover = ({ book, onBurn, onLike, onFavorite }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-white">
      <CardContent className="p-6">
        <div className="rounded-3xl bg-white text-black p-6 mb-6">
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={onBurn} className="rounded-full p-4 flex flex-col items-center">
            <Flame className="h-8 w-8 text-red-500" />
            <span className="text-xs mt-1 text-red-500">Burn</span>
          </Button>
          <Button variant="ghost" onClick={onFavorite} className="rounded-full p-4 flex flex-col items-center">
            <Heart className="h-8 w-8 text-white" />
            <span className="text-xs mt-1 text-white">Save</span>
          </Button>
          <Button variant="ghost" onClick={onLike} className="rounded-full p-4 flex flex-col items-center">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <span className="text-xs mt-1 text-purple-500">Like</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCover;
