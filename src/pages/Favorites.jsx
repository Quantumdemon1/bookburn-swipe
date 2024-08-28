import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Favorites = () => {
  // In a real app, you'd fetch this data from a backend or local storage
  const favoriteBooks = [
    {title: "A Tale of Two Cities", author: "Charles Dickens", price: 9.99},
    {title: "1984", author: "George Orwell", price: 12.99},
    {title: "Pride and Prejudice", author: "Jane Austen", price: 8.99},
    {title: "The Hobbit", author: "J.R.R. Tolkien", price: 14.99},
    {title: "To Kill a Mockingbird", author: "Harper Lee", price: 11.99},
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteBooks.map((book, index) => (
          <Card key={index} className="bg-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white">{book.title}</h3>
              <p className="text-sm text-gray-400 mb-4">by {book.author}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-500">${book.price.toFixed(2)}</span>
                <Button variant="outline" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;