import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { BookOpen, Flame, Heart, Clock, Users, ShoppingBag } from "lucide-react";

const books = [
  {title: "A Tale of Two Cities", author: "Charles Dickens", tags: ["classic", "historical", "fiction"], preview: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair."},
  {title: "1984", author: "George Orwell", tags: ["dystopian", "political", "fiction"], preview: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him."},
  {title: "Pride and Prejudice", author: "Jane Austen", tags: ["romance", "classic", "fiction"], preview: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters."},
  {title: "The Hobbit", author: "J.R.R. Tolkien", tags: ["fantasy", "adventure", "fiction"], preview: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort."},
  {title: "To Kill a Mockingbird", author: "Harper Lee", tags: ["classic", "coming-of-age", "fiction"], preview: "When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body, his thumb parallel to his thigh."}
];

const Index = () => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [likedTags, setLikedTags] = useState({});
  const [recommendedBooks, setRecommendedBooks] = useState([...books]);
  const { toast } = useToast();

  useEffect(() => {
    updateRecommendations();
  }, [likedTags]);

  const updateRecommendations = () => {
    const sortedBooks = [...books].sort((a, b) => {
      const aScore = a.tags.reduce((sum, tag) => sum + (likedTags[tag] || 0), 0);
      const bScore = b.tags.reduce((sum, tag) => sum + (likedTags[tag] || 0), 0);
      return bScore - aScore;
    });
    setRecommendedBooks(sortedBooks);
    setCurrentBookIndex(0);
  };

  const handleAction = (action) => {
    const currentBook = recommendedBooks[currentBookIndex];
    if (action === 'like' || action === 'favorite') {
      currentBook.tags.forEach(tag => {
        setLikedTags(prev => ({ ...prev, [tag]: (prev[tag] || 0) + 1 }));
      });
    }
    toast({
      title: action === 'burn' ? "Book Burned" : action === 'favorite' ? "Added to Favorites" : "Book Liked",
      description: `${currentBook.title} by ${currentBook.author}`,
    });
    setCurrentBookIndex((prevIndex) => (prevIndex + 1) % recommendedBooks.length);
  };

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
            <Link to="/match" className="flex items-center text-purple-500 hover:text-purple-300">
              <Flame className="mr-2" />
              Match
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/favorites" className="flex items-center text-white hover:text-gray-300">
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
          <h2 className="text-2xl font-bold">Match</h2>
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2">
              <Users className="h-6 w-6" />
            </Button>
            <Button variant="ghost">
              <ShoppingBag className="h-6 w-6" />
            </Button>
          </div>
        </header>
        {recommendedBooks.length > 0 && (
          <BookCard
            book={recommendedBooks[currentBookIndex]}
            onBurn={() => handleAction('burn')}
            onLike={() => handleAction('like')}
            onFavorite={() => handleAction('favorite')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
