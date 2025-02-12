
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import BookCover from '@/components/BookCover';

const books = [
  { 
    id: 1, 
    title: "A Tale of Two Cities", 
    author: "Charles Dickens", 
    coverUrl: "/placeholder.svg"  // Using local placeholder image
  },
  { 
    id: 2, 
    title: "1984", 
    author: "George Orwell", 
    coverUrl: "/placeholder.svg"
  },
  { 
    id: 3, 
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    coverUrl: "/placeholder.svg"
  },
  { 
    id: 4, 
    title: "The Hobbit", 
    author: "J.R.R. Tolkien", 
    coverUrl: "/placeholder.svg"
  },
  { 
    id: 5, 
    title: "To Kill a Mockingbird", 
    author: "Harper Lee", 
    coverUrl: "/placeholder.svg"
  },
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
    <div className="max-w-6xl mx-auto">
      <p className="text-xs text-gray-400 mb-4">
        Swipe through book covers and find your next favorite read!
      </p>
      {books.length > 0 && (
        <BookCover
          book={books[currentBookIndex]}
          onBurn={() => handleAction('burn')}
          onLike={() => handleAction('like')}
          onFavorite={() => handleAction('favorite')}
        />
      )}
    </div>
  );
};

export default Covers;
