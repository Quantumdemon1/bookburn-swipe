import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const Recent = () => {
  const recentBooks = [
    { id: 1, title: "Pride and Prejudice", author: "Jane Austen", liked: true },
    { id: 2, title: "The Catcher in the Rye", author: "J.D. Salinger", liked: false },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", liked: true },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recently Viewed Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{book.author}</p>
              <div className="mt-4 flex items-center">
                {book.liked ? (
                  <ThumbsUp className="text-green-500 mr-2" />
                ) : (
                  <ThumbsDown className="text-red-500 mr-2" />
                )}
                <span>{book.liked ? "Liked" : "Disliked"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recent;