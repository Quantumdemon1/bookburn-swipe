
// Simulated book database
export const books = [
  {id: 1, title: "A Tale of Two Cities", author: "Charles Dickens", tags: ["classic", "historical", "fiction"], preview: "It was the best of times, it was the worst of times..."},
  {id: 2, title: "1984", author: "George Orwell", tags: ["dystopian", "political", "fiction"], preview: "It was a bright cold day in April, and the clocks were striking thirteen..."},
  {id: 3, title: "Pride and Prejudice", author: "Jane Austen", tags: ["romance", "classic", "fiction"], preview: "It is a truth universally acknowledged..."},
  {id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", tags: ["fantasy", "adventure", "fiction"], preview: "In a hole in the ground there lived a hobbit..."},
  {id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", tags: ["classic", "coming-of-age", "fiction"], preview: "When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow..."},
];

// User preferences object to store tag weights
let userPreferences = {};

// Initialize user preferences
export const initializeUserPreferences = () => {
  books.forEach(book => {
    book.tags.forEach(tag => {
      if (!userPreferences[tag]) {
        userPreferences[tag] = 1; // Neutral weight
      }
    });
  });
};

// Update user preferences based on action
export const updateUserPreferences = (bookId, action, value = null) => {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  let weight;
  switch (action) {
    case 'like':
      weight = 0.1;
      break;
    case 'burn':
      weight = -0.1;
      break;
    case 'favorite':
      weight = 0.2;
      break;
    case 'rate':
      weight = (value - 3) * 0.05; // Adjust weight based on rating (1-5)
      break;
    case 'review':
      weight = 0.15; // Reviewing a book indicates strong engagement
      break;
    default:
      weight = 0;
  }

  book.tags.forEach(tag => {
    userPreferences[tag] = Math.max(0, Math.min(2, (userPreferences[tag] || 1) + weight));
  });

  // Save updated preferences to localStorage
  localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
};

// Get book recommendations based on user preferences
export const getRecommendations = (page = 1, limit = 10) => {
  // Load preferences from localStorage
  const storedPreferences = JSON.parse(localStorage.getItem('userPreferences'));
  if (storedPreferences) {
    userPreferences = storedPreferences;
  }

  const sortedBooks = books.map(book => ({
    ...book,
    score: book.tags.reduce((sum, tag) => sum + (userPreferences[tag] || 1), 0)
  })).sort((a, b) => b.score - a.score);

  const start = (page - 1) * limit;
  const end = start + limit;

  return sortedBooks.slice(start, end);
};

// Get next recommended book
export const getNextRecommendation = (currentBookId) => {
  const recommendations = getRecommendations();
  const currentIndex = recommendations.findIndex(book => book.id === currentBookId);
  return recommendations[(currentIndex + 1) % recommendations.length];
};

// Search books
export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
