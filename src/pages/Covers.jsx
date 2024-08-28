import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import BookCover from '@/components/BookCover';

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
