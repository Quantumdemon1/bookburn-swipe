import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Ratings = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", rating: 5 },
    { id: 3, title: "1984", author: "George Orwell", rating: 3 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", rating: 4 },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", rating: 2 },
  ]);

  const { toast } = useToast();

  const handleRating = (bookId, newRating) => {
    setFavoriteBooks(books =>
      books.map(book =>
        book.id === bookId ? { ...book, rating: newRating } : book
      )
    );
    toast({
      title: "Rating Updated",
      description: `You've rated this book ${newRating} stars.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rate Your Favorite Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle className="text-xl">{book.title}</CardTitle>
              <p className="text-sm text-gray-600">{book.author}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRating(book.id, star)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= book.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Ratings;