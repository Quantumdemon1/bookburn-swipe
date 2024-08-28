import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, ThumbsUp } from "lucide-react";

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-black text-white">
      <CardContent className="p-6">
        <div className="rounded-3xl bg-white text-black p-6 mb-6">
          <p className="text-xl font-bold">{book.preview}</p>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={onBurn} className="rounded-full p-4">
            <Flame className="h-8 w-8 text-red-500" />
          </Button>
          <Button variant="ghost" onClick={onFavorite} className="rounded-full p-4">
            <Heart className="h-8 w-8 text-white" />
          </Button>
          <Button variant="ghost" onClick={onLike} className="rounded-full p-4">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
