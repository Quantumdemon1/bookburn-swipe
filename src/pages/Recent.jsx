
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, BookOpen, Share2, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Recent = () => {
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();
  
  const recentBooks = [
    { 
      id: 1, 
      title: "Pride and Prejudice", 
      author: "Jane Austen", 
      liked: true,
      viewedAt: new Date('2024-03-14T10:00:00'),
      timeSpent: 45
    },
    { 
      id: 2, 
      title: "The Catcher in the Rye", 
      author: "J.D. Salinger", 
      liked: false,
      viewedAt: new Date('2024-03-13T15:30:00'),
      timeSpent: 30
    },
    { 
      id: 3, 
      title: "The Hobbit", 
      author: "J.R.R. Tolkien", 
      liked: true,
      viewedAt: new Date('2024-03-10T09:15:00'),
      timeSpent: 60
    },
  ];

  const groupedBooks = recentBooks.reduce((groups, book) => {
    const now = new Date();
    const viewDate = new Date(book.viewedAt);
    const dayDiff = Math.floor((now - viewDate) / (1000 * 60 * 60 * 24));

    let group = 'Earlier';
    if (dayDiff === 0) group = 'Today';
    else if (dayDiff === 1) group = 'Yesterday';
    else if (dayDiff < 7) group = 'This Week';

    if (!groups[group]) groups[group] = [];
    groups[group].push(book);
    return groups;
  }, {});

  const handleShare = (book) => {
    toast({
      title: "Share Link Copied!",
      description: `Share link for "${book.title}" has been copied to clipboard.`
    });
  };

  const handleReread = (book) => {
    toast({
      title: "Opening Book",
      description: `Opening "${book.title}" for re-reading.`
    });
  };

  const totalTimeSpent = recentBooks.reduce((total, book) => total + book.timeSpent, 0);
  const averageTimePerBook = Math.round(totalTimeSpent / recentBooks.length);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Recently Viewed Books</h1>
        <Card className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={`${viewMode === 'list' ? 'bg-primary/10' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Books Viewed</h3>
            <p className="text-3xl font-bold">{recentBooks.length}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Total Time</h3>
            <p className="text-3xl font-bold">{totalTimeSpent}m</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Avg. Time per Book</h3>
            <p className="text-3xl font-bold">{averageTimePerBook}m</p>
          </div>
        </div>
      </Card>

      {Object.entries(groupedBooks).map(([group, books]) => (
        <div key={group} className="space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">{group}</h2>
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {books.map((book) => (
              <Card 
                key={book.id}
                className={`group hover:shadow-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                <CardHeader className={viewMode === 'list' ? 'flex-1' : ''}>
                  <CardTitle className="flex items-center justify-between">
                    <span>{book.title}</span>
                    {book.liked ? (
                      <ThumbsUp className="text-green-500" />
                    ) : (
                      <ThumbsDown className="text-red-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(book.viewedAt).toLocaleTimeString()} - {book.timeSpent} minutes spent
                  </p>
                </CardHeader>
                <CardContent className={viewMode === 'list' ? 'flex justify-end gap-2' : ''}>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-primary/10 transition-colors"
                      onClick={() => handleReread(book)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Re-read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-primary/10 transition-colors"
                      onClick={() => handleShare(book)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recent;
