import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const favoriteBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 14.99 },
    { id: 3, title: "1984", author: "George Orwell", price: 11.99 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Favorite Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-lg font-bold mt-2">${book.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Purchase</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;