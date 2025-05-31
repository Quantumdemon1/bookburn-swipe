import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookPlus, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

const BookSelector = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getBooks({ searchQuery });
        setBooks(data || []);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [searchQuery]);

  const handleBookSelect = (book) => {
    if (!book) return;
    onBookSelect(book);
    setSearchQuery('');
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-500">
          <BookPlus className="h-4 w-4 mr-2" />
          Add Book Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Book to Review</DialogTitle>
          <DialogDescription>
            Search for a book to review or select from the list below
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : books.length > 0 ? (
              books.map((book) => (
                <Button
                  key={book.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => handleBookSelect(book)}
                >
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No books found matching your search
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookSelector;