import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import RatingStars from './reviews/RatingStars';
import FormatToolbar from './reviews/FormatToolbar';
import ShareButtons from './reviews/ShareButtons';
import { useTextFormat } from '@/hooks/useTextFormat';
import { useUser } from '@/contexts/UserContext';

const ReviewEditor = ({ bookId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { handleTextSelect, applyFormat } = useTextFormat(content, setContent);
  const { user } = useUser();

  const handleShare = async (platform) => {
    const shareData = {
      title: 'Check out this review',
      text: content.substring(0, 100) + '...',
      url: window.location.href
    };

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      default:
        try {
          await navigator.share(shareData);
        } catch (error) {
          toast({
            title: "Error",
            description: "Sharing not supported on this device",
            variant: "destructive"
          });
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a review.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write a review before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        content,
        rating,
        createdAt: new Date().toISOString()
      };

      await api.addReview(user.id, bookId, reviewData);
      toast({
        title: "Success",
        description: "Your review has been posted!"
      });
      setContent('');
      setRating(0);
      if (onReviewSubmitted) {
        await onReviewSubmitted();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?.id) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Please sign in to write a review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RatingStars rating={rating} onRatingChange={setRating} />
          <FormatToolbar onFormatClick={applyFormat} />
          <Textarea
            placeholder="Share your thoughts about this book..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelect}
            className="min-h-[150px] font-mono"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-500"
          >
            {isSubmitting ? "Posting..." : "Post Review"}
          </Button>
          <ShareButtons onShare={handleShare} />
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewEditor