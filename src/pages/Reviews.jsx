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
  const [filteredBooks, setFilteredBooks] = useState(books || []);
  const {
    toast
  } = useToast();
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const dummyUserId = 1;
  useEffect(() => {
    if (selectedBook) {
      loadReviews();
    }
  }, [selectedBook, sortOrder]);
  useEffect(() => {
    if (!books) return;
    setFilteredBooks(books.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);
  const loadReviews = async () => {
    if (!selectedBook) return;
    setIsLoading(true);
    try {
      const fetchedReviews = await api.getReviews(selectedBook.id);
      const sortedReviews = sortReviews(fetchedReviews || [], sortOrder);
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const sortReviews = (reviewsToSort, order) => {
    if (!Array.isArray(reviewsToSort)) return [];
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
  const handleBookSelect = book => {
    if (!book) return;
    setSelectedBook(book);
    setSearchQuery('');
  };
  const handleLike = async reviewId => {
    try {
      await api.likeReview(reviewId);
      await loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like review",
        variant: "destructive"
      });
    }
  };
  const handleReaction = async (reviewId, commentId, type) => {
    try {
      await api.addReaction(reviewId, commentId, type);
      await loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reaction",
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
  const handleCommentChange = (reviewId, comment) => {
    setNewComments(prev => ({
      ...prev,
      [reviewId]: comment
    }));
  };
  const handleCommentSubmit = async (reviewId, parentCommentId = null) => {
    if (!newComments[reviewId]?.trim()) return;
    try {
      await api.addComment(reviewId, {
        content: newComments[reviewId],
        parentCommentId
      });
      setNewComments(prev => ({
        ...prev,
        [reviewId]: ''
      }));
      setReplyingTo(null);
      await loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };
  const handleShare = async review => {
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
  return <div className="container mx-auto p-4 max-w-4xl">
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
              <Input type="text" placeholder="Search books by title or author..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredBooks.map(book => <Button key={book.id} variant="ghost" className="w-full justify-start text-left" onClick={() => handleBookSelect(book)}>
                    <div>
                      <div className="font-semibold">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </div>
                  </Button>)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedBook ? <>
          <div className="mb-6 p-4 rounded-lg bg-red-600 hover:bg-red-500">
            <h2 className="font-semibold text-lg">{selectedBook.title}</h2>
            <p className="text-slate-50">by {selectedBook.author}</p>
          </div>
          
          <ReviewEditor bookId={selectedBook.id} onReviewSubmitted={loadReviews} />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Reviews</h2>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border rounded-md p-2">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>

          <div className="space-y-6">
            {reviews.map(review => <ReviewCard key={review.id} review={review} onLike={handleLike} onReaction={handleReaction} onShare={handleShare} onToggleComments={toggleComments} onCommentSubmit={handleCommentSubmit} expandedComments={expandedComments} newComments={newComments} onCommentChange={handleCommentChange} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />)}
          </div>
        </> : <div className="text-center py-10 text-gray-500">
          Select a book to start reviewing
        </div>}
    </div>;
};
export default Reviews;