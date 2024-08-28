import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { useToast } from "@/components/ui/use-toast";

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
    <div className="max-w-5xl mx-auto">
      <p className="text-sm text-gray-400 mb-4">
        Swipe through book previews and find your next favorite read!
      </p>
      {recommendedBooks.length > 0 && (
        <BookCard
          book={{
            ...recommendedBooks[currentBookIndex],
            preview: recommendedBooks[currentBookIndex].preview.slice(0, 200) + (recommendedBooks[currentBookIndex].preview.length > 200 ? '...' : '')
          }}
          onBurn={() => handleAction('burn')}
          onLike={() => handleAction('like')}
          onFavorite={() => handleAction('favorite')}
        />
      )}
    </div>
  );
};

export default Index;
