
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookPlus } from 'lucide-react';
import { books } from '@/data/books';

const BookSelector = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!books) return;
    setFilteredBooks(
      books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
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
            {filteredBooks.map((book) => (
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
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookSelector;
