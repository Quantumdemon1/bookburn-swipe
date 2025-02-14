
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, BookOpen, Share2 } from "lucide-react";

const BookList = ({ group, books, viewMode, onReread, onShare }) => {
  return (
    <div className="space-y-4">
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
                  onClick={() => onReread(book)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Re-read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 group-hover:bg-primary/10 transition-colors"
                  onClick={() => onShare(book)}
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
  );
};

export default BookList;

