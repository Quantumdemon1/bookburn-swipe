
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import BookContent from './book/BookContent';
import ActionButton from './book/ActionButton';
import CartButton from './book/CartButton';
import { useBookActions } from '@/hooks/useBookActions';

const BookCard = ({ book, onBurn, onLike, onFavorite }) => {
  const { addToCart } = useCart();
  const {
    burnClicked,
    saveClicked,
    likeClicked,
    isLoading,
    retryAction,
    handleAction,
    handleAddToCart
  } = useBookActions(book, addToCart);

  const actions = [
    {
      icon: Flame,
      label: 'BURN',
      onClick: () => handleAction('burn', onBurn),
      isClicked: burnClicked,
      color: 'red',
      animation: {
        rotate: [0, -10, 10, -10, 0],
        scale: [1, 1.2, 0.8, 1.1, 1]
      }
    },
    {
      icon: Heart,
      label: 'SAVE',
      onClick: () => handleAction('save', onFavorite),
      isClicked: saveClicked,
      color: 'pink',
      animation: {
        scale: [1, 1.4, 0.8, 1.2, 1],
        rotate: [0, 15, -15, 15, 0]
      }
    },
    {
      icon: ThumbsUp,
      label: 'LIKE',
      onClick: () => handleAction('like', onLike),
      isClicked: likeClicked,
      color: 'blue',
      animation: {
        scale: [1, 1.5, 1],
        y: [0, -10, 0]
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:w-auto"
      whileTap={{ scale: 0.98 }}
    >
      <Card className="w-full max-w-sm mx-auto bg-black text-white overflow-hidden touch-manipulation">
        <CardContent className="p-4 sm:p-6">
          <BookContent book={book} />
          
          <div className="flex justify-between items-center gap-2">
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                {...action}
                isLoading={isLoading}
                isRetrying={isLoading && retryAction?.action === action.label.toLowerCase()}
              />
            ))}
          </div>

          <CartButton 
            onClick={handleAddToCart}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookCard;
