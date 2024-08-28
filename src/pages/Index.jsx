import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";

const books = [
  {title: "The Midnight Chronicle", author: "A. Writer", tags: ["mystery", "suspense", "detective"], preview: "The clock struck midnight as Detective Sarah..."},
  {title: "Starbound", author: "B. Author", tags: ["scifi", "space", "adventure"], preview: "Captain Alex gazed out at the vast expanse..."},
  {title: "Whispers in the Wind", author: "C. Novelist", tags: ["romance", "contemporary", "smalltown"], preview: "Emma stepped off the bus, breathing in the..."},
  {title: "The Enchanted Forest", author: "D. Storyteller", tags: ["fantasy", "magic", "youngadult"], preview: "Lily stumbled upon the ancient oak tree..."},
  {title: "Tech Titans", author: "E. Journalist", tags: ["nonfiction", "technology", "business"], preview: "In the early days of Silicon Valley..."}
];

const Index = () => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [likedTags, setLikedTags] = useState({});
  const [recommendedBooks, setRecommendedBooks] = useState([...books]);
  const { toast } = useToast();

  useEffect(() => {
    updateRecommendations();
  }, [likedTags]);

  const updateRecommendations = () => {
    const sortedBooks = [...books].sort((a, b) => {
      const aScore = a.tags.reduce((sum, tag) => sum + (likedTags[tag] || 0), 0);
      const bScore = b.tags.reduce((sum, tag) => sum + (likedTags[tag] || 0), 0);
      return bScore - aScore;
    });
    setRecommendedBooks(sortedBooks);
    setCurrentBookIndex(0);
  };

  const handleAction = (action) => {
    const currentBook = recommendedBooks[currentBookIndex];
    if (action === 'like' || action === 'favorite') {
      currentBook.tags.forEach(tag => {
        setLikedTags(prev => ({ ...prev, [tag]: (prev[tag] || 0) + 1 }));
      });
    }
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`,
    });
    setCurrentBookIndex((prevIndex) => (prevIndex + 1) % recommendedBooks.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">BookSwipe</h1>
      {recommendedBooks.length > 0 && (
        <BookCard
          book={recommendedBooks[currentBookIndex]}
          onBurn={() => handleAction('burn')}
          onLike={() => handleAction('like')}
          onFavorite={() => handleAction('favorite')}
        />
      )}
    </div>
  );
};

export default Index;
