import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, updateUserPreferences, searchBooks } from '@/utils/recommendationAlgorithm';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isNewUser, setIsNewUser] = useState(true);
  const { toast } = useToast();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMoreBooks = useCallback(() => {
    const newBooks = getRecommendations(page, 10, selectedGenre);
    setBooks(prevBooks => [...prevBooks, ...newBooks]);
    setPage(prevPage => prevPage + 1);
  }, [page, selectedGenre]);

  useEffect(() => {
    if (!isSearching) {
      setBooks([]);
      setPage(1);
      loadMoreBooks();
    }
  }, [isSearching, loadMoreBooks, selectedGenre]);

  useEffect(() => {
    if (inView && !isSearching) {
      loadMoreBooks();
    }
  }, [inView, isSearching, loadMoreBooks]);

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
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `Action taken on book ${bookId}`,
    });
  };

  const handleSearch = (query) => {
    setIsSearching(true);
    const searchResults = searchBooks(query);
    setBooks(searchResults);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setIsSearching(false);
    setBooks([]);
    setPage(1);
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
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="sci-fi">Science Fiction</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-gray-400 my-4">
        {isSearching ? "Search results:" : `Showing ${selectedGenre === 'all' ? 'all genres' : selectedGenre}. Scroll for more!`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <BookCard
            key={`${book.id}-${index}`}
            book={{
              ...book,
              preview: book.preview.slice(0, 200) + (book.preview.length > 200 ? '...' : '')
            }}
            onBurn={() => handleAction(book.id, 'burn')}
            onLike={() => handleAction(book.id, 'like')}
            onFavorite={() => handleAction(book.id, 'favorite')}
          />
        ))}
      </div>
      {!isSearching && books.length > 0 && (
        <div ref={ref} className="text-center mt-8">
          <Button onClick={loadMoreBooks} variant="outline">Load More Books</Button>
        </div>
      )}
      {books.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No books found. Try adjusting your search or genre filter.</p>
        </div>
      )}
    </div>
  );
};

export default Index;
