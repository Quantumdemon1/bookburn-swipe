import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
const ReviewEditor = ({
  bookId,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const {
    toast
  } = useToast();
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };
  const applyFormat = format => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = content;
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'ordered-list':
        formattedText = `\n1. ${selectedText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        }
        break;
      default:
        return;
    }
    if (formattedText) {
      const newContent = currentContent.substring(0, start) + formattedText + currentContent.substring(end);
      setContent(newContent);
    }
  };
  const handleShare = async platform => {
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
  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write a review before submitting.",
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
      await api.addReview(1, bookId, reviewData);
      toast({
        title: "Success",
        description: "Your review has been posted!"
      });
      setContent('');
      setRating(0);
      onReviewSubmitted?.();
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
  return <Card className="mb-6">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => <Button key={star} variant="ghost" size="sm" type="button" onClick={() => setRating(star)}>
                <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              </Button>)}
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('bold')}>
              <Bold className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('italic')}>
              <Italic className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('underline')}>
              <Underline className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('list')}>
              <List className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('ordered-list')}>
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyFormat('link')}>
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
          <Textarea placeholder="Share your thoughts about this book..." value={content} onChange={e => setContent(e.target.value)} onSelect={handleTextSelect} className="min-h-[150px] font-mono" />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-500">
            {isSubmitting ? "Posting..." : "Post Review"}
          </Button>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => handleShare('twitter')}>
              Share on Twitter
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleShare('facebook')}>
              Share on Facebook
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
              Share on LinkedIn
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
};
export default ReviewEditor;