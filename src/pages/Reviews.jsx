
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ReviewEditor from '@/components/ReviewEditor';
import { api } from '@/services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState(1); // Dummy book ID for now

  useEffect(() => {
    loadReviews();
  }, [selectedBook]);

  const loadReviews = async () => {
    try {
      const fetchedReviews = await api.getReviews(selectedBook);
      setReviews(fetchedReviews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    }
  };

  const handleLike = async (reviewId) => {
    // Implementation for liking reviews will come in the next phase
    toast({
      title: "Coming Soon",
      description: "Like functionality will be available soon!",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>
      
      <ReviewEditor 
        bookId={selectedBook} 
        onReviewSubmitted={loadReviews}
      />

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">
                    {review.user?.username || "Anonymous"}
                  </CardTitle>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{review.content}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(review.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.likes || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{review.comments?.length || 0}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
