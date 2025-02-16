
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

const RatingStars = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => onRatingChange(star)}
        >
          <Star 
            className={`w-6 h-6 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`} 
          />
        </Button>
      ))}
    </div>
  );
};

export default RatingStars;
