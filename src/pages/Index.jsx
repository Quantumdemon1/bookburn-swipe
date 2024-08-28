import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import { getRecommendations, updateUserPreferences, searchBooks } from '@/utils/recommendationAlgorithm';

const Index = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMoreBooks = useCallback(() => {
    const newBooks = getRecommendations(page, 10);
    setBooks(prevBooks => [...prevBooks, ...newBooks]);
    setPage(prevPage => prevPage + 1);
  }, [page]);

  useEffect(() => {
    if (!isSearching) {
      loadMoreBooks();
    }
  }, [isSearching, loadMoreBooks]);

  useEffect(() => {
    if (inView && !isSearching) {
      loadMoreBooks();
    }
  }, [inView, isSearching, loadMoreBooks]);

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

  return (
    <div className="max-w-5xl mx-auto">
      <SearchBar onSearch={handleSearch} />
      <p className="text-sm text-gray-400 my-4">
        {isSearching ? "Search results:" : "Scroll through book previews and find your next favorite read!"}
      </p>
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
      {!isSearching && <div ref={ref} className="h-10" />}
    </div>
  );
};

export default Index;
