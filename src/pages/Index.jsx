
import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, updateUserPreferences, searchBooks, getNextRecommendation } from '@/utils/recommendationAlgorithm';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isNewUser, setIsNewUser] = useState(true);
  const { toast } = useToast();
  const { ref } = useInView({
    threshold: 0,
  });

  // Load initial book
  useEffect(() => {
    if (!isSearching) {
      const initialBooks = getRecommendations(1, 1, selectedGenre);
      if (initialBooks.length > 0) {
        setCurrentBook(initialBooks[0]);
      }
    }
  }, [isSearching, selectedGenre]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsNewUser(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      setIsNewUser(false);
    }
  }, []);

  const handleAction = (bookId, action) => {
    updateUserPreferences(bookId, action);
    
    // Get next book recommendation
    const nextBook = getNextRecommendation(bookId);
    setCurrentBook(nextBook);
    
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `Action taken on book ${bookId}`,
    });
  };

  const handleSearch = (query) => {
    setIsSearching(true);
    const searchResults = searchBooks(query);
    if (searchResults.length > 0) {
      setCurrentBook(searchResults[0]);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setIsSearching(false);
    const newBooks = getRecommendations(1, 1, genre);
    if (newBooks.length > 0) {
      setCurrentBook(newBooks[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {isNewUser && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold">Welcome to Book Burn!</p>
          <p>Start exploring books by swiping through recommendations or use the search bar to find specific titles.</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <Select onValueChange={handleGenreChange} defaultValue="all">
          <SelectTrigger className="w-[180px] mt-4 md:mt-0">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {currentBook ? (
          <BookCard
            key={currentBook.id}
            book={currentBook}
            onBurn={() => handleAction(currentBook.id, 'burn')}
            onLike={() => handleAction(currentBook.id, 'like')}
            onFavorite={() => handleAction(currentBook.id, 'favorite')}
          />
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-500">No books found. Try adjusting your search or genre filter.</p>
          </div>
        )}
      </div>
      <div ref={ref} className="text-center mt-8">
        <Button 
          onClick={() => {
            if (currentBook) {
              const nextBook = getNextRecommendation(currentBook.id);
              setCurrentBook(nextBook);
            }
          }} 
          variant="outline"
        >
          Next Book
        </Button>
      </div>
    </div>
  );
};

export default Index;
