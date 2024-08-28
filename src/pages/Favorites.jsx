import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Favorites = () => {
  // In a real app, you'd fetch this data from a backend or local storage
  const favoriteBooks = [
    {title: "The Midnight Chronicle", author: "A. Writer"},
    {title: "Starbound", author: "B. Author"},
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteBooks.map((book, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">{book.title}</h2>
              <p className="text-sm text-gray-500">by {book.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;