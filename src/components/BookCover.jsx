import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const BookCover = ({
  book,
  onBurn,
  onLike,
  onFavorite
}) => {
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const handleBurn = () => {
    setBurnClicked(true);
    setTimeout(() => setBurnClicked(false), 1000);
    onBurn();
  };
  const handleSave = () => {
    setSaveClicked(true);
    setTimeout(() => setSaveClicked(false), 1000);
    onFavorite();
  };
  const handleLike = () => {
    setLikeClicked(true);
    setTimeout(() => setLikeClicked(false), 1000);
    onLike();
  };
  return <Card className="w-full max-w-4xl mx-auto bg-black text-white">
      <CardContent className="p-6">
        <div className="rounded-3xl bg-white text-black p-6 mb-6">
          <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="w-full h-100 rounded-none object-cover" />
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleBurn} className={`rounded-full p-4 flex flex-col items-center transition-transform ${burnClicked ? 'animate-burn' : ''}`}>
            <span className="text-4xl mb-1">🔥</span>
            <span className="text-xs text-red-500">BURN</span>
          </Button>
          <Button variant="ghost" onClick={handleSave} className={`rounded-full p-4 flex flex-col items-center transition-transform ${saveClicked ? 'animate-save' : ''}`}>
            <span className="text-4xl mb-1">❤️</span>
            <span className="text-xs text-white">SAVE</span>
          </Button>
          <Button variant="ghost" onClick={handleLike} className={`rounded-full p-4 flex flex-col items-center transition-transform ${likeClicked ? 'animate-like' : ''}`}>
            <span className="text-4xl mb-1">👍</span>
            <span className="text-xs text-indigo-500">LIKE</span>
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default BookCover;