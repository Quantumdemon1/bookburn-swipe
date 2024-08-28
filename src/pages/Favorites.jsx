import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Flame, Heart, Clock, Users, ShoppingBag } from "lucide-react";

const Favorites = () => {
  // In a real app, you'd fetch this data from a backend or local storage
  const favoriteBooks = [
    {title: "A Tale of Two Cities", author: "Charles Dickens"},
    {title: "1984", author: "George Orwell"},
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      <nav className="w-64 bg-black p-4">
        <h1 className="text-2xl font-bold mb-8">Book Burn</h1>
        <ul>
          <li className="mb-4">
            <Link to="/" className="flex items-center text-white hover:text-gray-300">
              <BookOpen className="mr-2" />
              Covers
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/match" className="flex items-center text-white hover:text-gray-300">
              <Flame className="mr-2" />
              Match
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/favorites" className="flex items-center text-red-500 hover:text-red-300">
              <Heart className="mr-2" />
              Favorites
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/recent" className="flex items-center text-white hover:text-gray-300">
              <Clock className="mr-2" />
              Recent
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/friends" className="flex items-center text-white hover:text-gray-300">
              <Users className="mr-2" />
              Friends
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-4">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Favorites</h2>
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2">
              <Users className="h-6 w-6" />
            </Button>
            <Button variant="ghost">
              <ShoppingBag className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteBooks.map((book, index) => (
            <Card key={index} className="bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2 text-white">{book.title}</h2>
                <p className="text-sm text-gray-400">by {book.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
