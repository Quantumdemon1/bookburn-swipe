
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ReviewEditor from '@/components/ReviewEditor';
import BookSelector from '@/components/reviews/BookSelector';
import ReviewList from '@/components/reviews/ReviewList';
import { useReviews } from '@/hooks/useReviews';

const Reviews = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const { toast } = useToast();
  const { 
    reviews, 
    isLoading, 
    sortOrder, 
    setSortOrder, 
    handleLike, 
    handleReaction, 
    loadReviews 
  } = useReviews(selectedBook);

  const handleReviewSubmitted = async () => {
    await loadReviews();
    toast({
      title: "Success",
      description: "Your review has been posted successfully!",
    });
  };

  const handleShare = async (review) => {
    try {
      const shareData = {
        title: `Review of ${selectedBook?.title}`,
        text: review.content.substring(0, 100) + '...',
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        toast({
          title: "Info",
          description: "Sharing is not supported on this device"
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share review",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book Reviews</h1>
        <BookSelector onBookSelect={setSelectedBook} />
      </div>

      {selectedBook ? (
        <>
          <div className="mb-6 p-4 rounded-lg bg-red-600 hover:bg-red-500 text-white">
            <h2 className="font-semibold text-lg">{selectedBook.title}</h2>
            <p>by {selectedBook.author}</p>
          </div>
          
          <ReviewEditor 
            bookId={selectedBook.id} 
            onReviewSubmitted={handleReviewSubmitted}
          />

          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            onLike={handleLike}
            onReaction={handleReaction}
            onShare={handleShare}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Select a book to start reviewing
        </div>
      )}
    </div>
  );
};

export default Reviews;
