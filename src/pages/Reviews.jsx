import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ReviewEditor from '@/components/ReviewEditor';
import ReviewCard from '@/components/ReviewCard';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from '@/services/api';
import { books } from '@/data/books';
import { BookPlus } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { toast } = useToast();
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const dummyUserId = 1;

  useEffect(() => {
    if (selectedBook) {
      loadReviews();
    }
  }, [selectedBook, sortOrder]);

  useEffect(() => {
    setFilteredBooks(
      books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const loadReviews = async () => {
    if (!selectedBook) return;
    try {
      const fetchedReviews = await api.getReviews(selectedBook.id);
      const sortedReviews = sortReviews(fetchedReviews, sortOrder);
      setReviews(sortedReviews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSearchQuery('');
  };

  const sortReviews = (reviewsToSort, order) => {
    return [...reviewsToSort].sort((a, b) => {
      switch (order) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  };

  const handleLike = async reviewId => {
    try {
      const {
        likes,
        hasLiked
      } = await api.toggleLike(reviewId, dummyUserId);
      setReviews(prevReviews => prevReviews.map(review => review.id === reviewId ? {
        ...review,
        likes,
        hasLiked
      } : review));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleReaction = async (reviewId, commentId, reactionType) => {
    try {
      const updatedReactions = await api.addReaction(reviewId, commentId, dummyUserId, reactionType);
      setReviews(prevReviews => prevReviews.map(review => {
        if (review.id !== reviewId) return review;
        if (!commentId) {
          return {
            ...review,
            reactions: updatedReactions
          };
        }
        const updateCommentReactions = comments => comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              reactions: updatedReactions
            };
          }
          if (comment.replies?.length) {
            return {
              ...comment,
              replies: updateCommentReactions(comment.replies)
            };
          }
          return comment;
        });
        return {
          ...review,
          comments: updateCommentReactions(review.comments || [])
        };
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    }
  };

  const toggleComments = reviewId => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleCommentChange = (reviewId, value) => {
    setNewComments(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  const handleCommentSubmit = async (reviewId, parentId = null) => {
    const content = newComments[reviewId]?.trim();
    if (!content) return;
    try {
      const comment = await api.addComment(reviewId, dummyUserId, content, parentId);
      setReviews(prevReviews => prevReviews.map(review => review.id === reviewId ? {
        ...review,
        comments: parentId ? updateCommentsWithReply(review.comments || [], parentId, comment) : [...(review.comments || []), comment]
      } : review));
      setNewComments(prev => ({
        ...prev,
        [reviewId]: ''
      }));
      setReplyingTo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  const updateCommentsWithReply = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies, parentId, newReply)
        };
      }
      return comment;
    });
  };

  const handleShare = async review => {
    try {
      await navigator.share({
        title: 'Check out this book review',
        text: `${review.content.substring(0, 100)}...`,
        url: window.location.href
      });
    } catch (error) {
      toast({
        title: "Info",
        description: "Sharing is not supported on this device"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book Reviews</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-500">
              <BookPlus className="h-4 w-4 mr-2" />
              Add Book Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Book to Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredBooks.map((book) => (
                  <Button
                    key={book.id}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleBookSelect(book)}
                  >
                    <div>
                      <div className="font-semibold">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedBook ? (
        <>
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold text-lg">{selectedBook.title}</h2>
            <p className="text-gray-600">by {selectedBook.author}</p>
          </div>
          
          <ReviewEditor 
            bookId={selectedBook.id} 
            onReviewSubmitted={loadReviews} 
          />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Reviews</h2>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-md p-2 bg-red-600 hover:bg-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>

          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLike}
                onReaction={handleReaction}
                onShare={handleShare}
                onToggleComments={toggleComments}
                onCommentSubmit={handleCommentSubmit}
                expandedComments={expandedComments}
                newComments={newComments}
                onCommentChange={handleCommentChange}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
              />
            ))}
          </div>
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
