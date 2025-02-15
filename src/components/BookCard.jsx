
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Flame, Heart, ThumbsUp, Loader } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [burnClicked, setBurnClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  const handleAction = async (action, handler) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setRetryAction(null);

    try {
      switch(action) {
        case 'burn':
          setBurnClicked(true);
          await handler();
          setTimeout(() => setBurnClicked(false), 1000);
          break;
        case 'save':
          setSaveClicked(true);
          await handler();
          setTimeout(() => setSaveClicked(false), 1000);
          break;
        case 'like':
          setLikeClicked(true);
          await handler();
          setTimeout(() => setLikeClicked(false), 1000);
          break;
      }
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      setRetryAction({ action, handler });
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to ${action} the book. Click to try again.`,
        action: (
          <Button 
            variant="outline" 
            onClick={() => handleAction(action, handler)}
            className="bg-white text-red-500 hover:bg-red-50"
          >
            Retry
          </Button>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(book);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Added to Cart",
        description: `${book.title} has been added to your cart`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Add to Cart",
        description: "Please try again",
        action: (
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            className="bg-white text-red-500 hover:bg-red-50"
          >
            Retry
          </Button>
        ),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full max-w-4xl mx-auto bg-black text-white overflow-hidden">
        <CardContent className="p-6">
          <motion.div 
            className="rounded-3xl bg-white text-black p-6 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={book.id}
                src={book.coverUrl || '/placeholder.svg'} 
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              <p className="text-lg mb-4">by {book.author}</p>
              <p className="text-gray-600">{book.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {book.tags.map((tag, index) => (
                  <motion.span 
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                onClick={() => handleAction('burn', onBurn)}
                className={`rounded-full p-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading && retryAction?.action === 'burn' ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  <motion.div 
                    animate={burnClicked ? {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.2, 0.8, 1.1, 1]
                    } : {}}
                  >
                    <Flame className="h-8 w-8 text-red-500" />
                  </motion.div>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                onClick={() => handleAction('save', onFavorite)}
                className={`rounded-full p-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading && retryAction?.action === 'save' ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  <motion.div 
                    animate={saveClicked ? {
                      scale: [1, 1.4, 0.8, 1.2, 1],
                      rotate: [0, 15, -15, 15, 0]
                    } : {}}
                  >
                    <Heart className="h-8 w-8 text-pink-500" />
                  </motion.div>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                onClick={() => handleAction('like', onLike)}
                className={`rounded-full p-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading && retryAction?.action === 'like' ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  <motion.div 
                    animate={likeClicked ? {
                      scale: [1, 1.5, 1],
                      y: [0, -10, 0]
                    } : {}}
                  >
                    <ThumbsUp className="h-8 w-8 text-blue-500" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              Add to Cart
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookCard;
