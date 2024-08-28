import { books } from '../utils/recommendationAlgorithm.js';

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
    const newReview = { id: Date.now(), userId, bookId, ...reviewData };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return { success: true, review: newReview };
  },

  getReviews: async (bookId) => {
    await delay(300);
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(review => review.bookId === bookId);
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
};
