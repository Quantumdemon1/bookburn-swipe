import { books } from '../data/books';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (email, password) => {
    await delay(500); // Simulate network delay
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user: { ...user, password: undefined } };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    const newUser = { ...userData, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: { ...newUser, password: undefined } };
  },

  getRecommendations: async (userId) => {
    await delay(300);
    const userPreferences = JSON.parse(localStorage.getItem(`userPreferences_${userId}`) || '{}');
    return books.map(book => ({
      ...book,
      score: book.tags.reduce((sum, tag) => sum + (userPreferences[tag] || 1), 0)
    })).sort((a, b) => b.score - a.score);
  },

  updatePreferences: async (userId, bookId, action) => {
    await delay(200);
    const userPreferences = JSON.parse(localStorage.getItem(`userPreferences_${userId}`) || '{}');
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.tags.forEach(tag => {
        userPreferences[tag] = (userPreferences[tag] || 1) + (action === 'like' ? 0.1 : -0.1);
      });
    }
    localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(userPreferences));
    return { success: true };
  },

  getUserProfile: async (userId) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      return { ...user, password: undefined };
    }
    throw new Error('User not found');
  },

  updateUserProfile: async (userId, userData) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true, user: { ...users[index], password: undefined } };
    }
    throw new Error('User not found');
  },

  addReview: async (userId, bookId, reviewData) => {
    await delay(300);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const newReview = {
      id: Date.now(),
      userId,
      bookId,
      ...reviewData,
      likes: 0,
      comments: [],
      reactions: {
        like: 0,
        heart: 0,
        laugh: 0,
        surprised: 0,
      },
      likedBy: [],
      reactedBy: {},
    };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return { success: true, review: newReview };
  },

  getReviews: async (bookId) => {
    await delay(300);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(review => review.bookId === bookId);
  },

  addComment: async (reviewId, userId, content, parentId = null) => {
    await delay(200);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    const newComment = {
      id: Date.now(),
      userId,
      content,
      createdAt: new Date().toISOString(),
      parentId,
      reactions: {
        like: 0,
        heart: 0,
        laugh: 0,
        surprised: 0,
      },
      replies: [],
    };

    if (parentId) {
      // Add reply to parent comment
      const addReplyToComment = (comments) => {
        for (let comment of comments) {
          if (comment.id === parentId) {
            comment.replies.push(newComment);
            return true;
          }
          if (comment.replies?.length) {
            const found = addReplyToComment(comment.replies);
            if (found) return true;
          }
        }
        return false;
      };

      addReplyToComment(reviews[reviewIndex].comments);
    } else {
      // Add top-level comment
      if (!reviews[reviewIndex].comments) {
        reviews[reviewIndex].comments = [];
      }
      reviews[reviewIndex].comments.push(newComment);
    }

    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newComment;
  },

  addReaction: async (reviewId, commentId, userId, reactionType) => {
    await delay(200);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }

    const updateReactions = (item) => {
      if (!item.reactedBy) {
        item.reactedBy = {};
      }
      if (!item.reactions) {
        item.reactions = { like: 0, heart: 0, laugh: 0, surprised: 0 };
      }

      const previousReaction = item.reactedBy[userId];
      if (previousReaction === reactionType) {
        // Remove reaction
        delete item.reactedBy[userId];
        item.reactions[reactionType]--;
      } else {
        // Update reaction
        if (previousReaction) {
          item.reactions[previousReaction]--;
        }
        item.reactedBy[userId] = reactionType;
        item.reactions[reactionType]++;
      }

      return item.reactions;
    };

    if (commentId) {
      const findAndUpdateComment = (comments) => {
        for (let comment of comments) {
          if (comment.id === commentId) {
            return updateReactions(comment);
          }
          if (comment.replies?.length) {
            const result = findAndUpdateComment(comment.replies);
            if (result) return result;
          }
        }
        return null;
      };

      const updatedReactions = findAndUpdateComment(review.comments);
      if (!updatedReactions) {
        throw new Error('Comment not found');
      }

      localStorage.setItem('reviews', JSON.stringify(reviews));
      return updatedReactions;
    } else {
      const updatedReactions = updateReactions(review);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      return updatedReactions;
    }
  },

  toggleLike: async (reviewId, userId) => {
    await delay(200);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    const likedBy = reviews[reviewIndex].likedBy || [];
    const hasLiked = likedBy.includes(userId);

    if (hasLiked) {
      reviews[reviewIndex].likedBy = likedBy.filter(id => id !== userId);
      reviews[reviewIndex].likes = (reviews[reviewIndex].likes || 0) - 1;
    } else {
      reviews[reviewIndex].likedBy = [...likedBy, userId];
      reviews[reviewIndex].likes = (reviews[reviewIndex].likes || 0) + 1;
    }

    localStorage.setItem('reviews', JSON.stringify(reviews));
    return {
      likes: reviews[reviewIndex].likes,
      hasLiked: !hasLiked
    };
  },

  updateRating: async (userId, bookId, rating) => {
    await delay(200);
    const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
    const index = ratings.findIndex(r => r.userId === userId && r.bookId === bookId);
    if (index !== -1) {
      ratings[index].rating = rating;
    } else {
      ratings.push({ userId, bookId, rating });
    }
    localStorage.setItem('ratings', JSON.stringify(ratings));
    return { success: true };
  },

  getConversations: async () => {
    await delay(300);
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    return conversations.map(conv => ({
      id: conv.id,
      participants: conv.participants || [],
      messages: conv.messages || [],
      friendName: conv.friendName || 'User',
      friendAvatar: conv.friendAvatar || '/placeholder.svg'
    }));
  },

  sendMessage: async (conversationId, message) => {
    await delay(200);
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) {
      throw new Error('Conversation not found');
    }
    const newMessage = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      delivered: true,
      read: false
    };
    conversations[conversationIndex].messages.push(newMessage);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    return newMessage;
  },

  createConversation: async (userId, friendId, friendName, friendAvatar) => {
    await delay(300);
    const newConversation = {
      id: Date.now(),
      participants: [userId, friendId],
      messages: [],
      friendName: friendName || 'User',
      friendAvatar: friendAvatar || '/placeholder.svg'
    };
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    conversations.push(newConversation);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    return newConversation;
  },
};
