import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const books = [
  { id: 1, title: "A Tale of Two Cities", author: "Charles Dickens", coverUrl: "https://example.com/cover1.jpg" },
  { id: 2, title: "1984", author: "George Orwell", coverUrl: "https://example.com/cover2.jpg" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", coverUrl: "https://example.com/cover3.jpg" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", coverUrl: "https://example.com/cover4.jpg" },
  { id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", coverUrl: "https://example.com/cover5.jpg" },
];

const Covers = () => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const { toast } = useToast();

  const handleAction = (action) => {
    const currentBook = books[currentBookIndex];
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`,
    });
    setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-xs text-gray-400 mb-4">
        Swipe through book covers and find your next favorite read!
      </p>
      {books.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto bg-black text-white">
          <CardContent className="p-6">
            <div className="rounded-3xl bg-white text-black p-6 mb-6">
              <img
                src={books[currentBookIndex].coverUrl}
                alt={`Cover of ${books[currentBookIndex].title}`}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => handleAction('burn')} className="rounded-full p-4">
                <Flame className="h-8 w-8 text-red-500" />
              </Button>
              <Button variant="ghost" onClick={() => handleAction('favorite')} className="rounded-full p-4">
                <Heart className="h-8 w-8 text-white" />
              </Button>
              <Button variant="ghost" onClick={() => handleAction('like')} className="rounded-full p-4">
                <ThumbsUp className="h-8 w-8 text-purple-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Covers;