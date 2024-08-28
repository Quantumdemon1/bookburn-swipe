import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/components/ui/use-toast";

const Favorites = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const favoriteBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, rating: 4.5, format: "Paperback" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 14.99, rating: 4.8, format: "Hardcover" },
    { id: 3, title: "1984", author: "George Orwell", price: 11.99, rating: 4.6, format: "Kindle Edition" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 9.99, rating: 4.7, format: "Paperback" },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 13.99, rating: 4.3, format: "Hardcover" },
  ];

  const handleAddToCart = (book) => {
    addToCart(book);
    toast({
      title: "Added to Cart",
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteBooks.map((book) => (
          <Card key={book.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{book.title}</CardTitle>
              <p className="text-sm text-gray-600">{book.author}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{book.rating}</span>
              </div>
              <p className="text-sm mb-2">{book.format}</p>
              <p className="text-2xl font-bold text-green-600">${book.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={() => handleAddToCart(book)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
