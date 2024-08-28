import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const Recent = () => {
  // In a real app, you'd fetch this data from a backend or local storage
  const recentBooks = [
    {title: "A Tale of Two Cities", author: "Charles Dickens", liked: true},
    {title: "1984", author: "George Orwell", liked: false},
    {title: "Pride and Prejudice", author: "Jane Austen", liked: true},
    {title: "The Hobbit", author: "J.R.R. Tolkien", liked: true},
    {title: "To Kill a Mockingbird", author: "Harper Lee", liked: false},
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Recently Viewed</h2>
      <div className="space-y-4">
        {recentBooks.map((book, index) => (
          <Card key={index} className="bg-gray-800">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{book.title}</h3>
                <p className="text-sm text-gray-400">by {book.author}</p>
              </div>
              {book.liked ? (
                <ThumbsUp className="h-6 w-6 text-green-500" />
              ) : (
                <ThumbsDown className="h-6 w-6 text-red-500" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recent;