
// Simulated book database with public domain content
export const books = [
  {
    id: 1, 
    title: "Robinson Crusoe", 
    author: "Daniel Defoe", 
    price: 9.99,
    tags: ["adventure", "classic", "survival"],
    preview: "I was born in the year 1632, in the city of York, of a good family. My father was a foreign merchant originally from Bremen, who settled first at Hull.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2, 
    title: "The Art of War", 
    author: "Sun Tzu", 
    price: 7.99,
    tags: ["strategy", "classic", "non-fiction"],
    preview: "The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin.",
    coverUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3, 
    title: "The Wealth of Nations", 
    author: "Adam Smith", 
    price: 12.99,
    tags: ["economics", "classic", "non-fiction"],
    preview: "The annual labour of every nation is the fund which originally supplies it with all the necessaries and conveniences of life which it annually consumes.",
    coverUrl: "https://images.unsplash.com/photo-1554495439-b6807d1ecf1a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4, 
    title: "Frankenstein", 
    author: "Mary Shelley", 
    price: 8.99,
    tags: ["horror", "classic", "science-fiction"],
    preview: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
    coverUrl: "https://images.unsplash.com/photo-1601524738525-22614e09fde2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5, 
    title: "The Count of Monte Cristo", 
    author: "Alexandre Dumas", 
    price: 11.99,
    tags: ["adventure", "classic", "revenge"],
    preview: "On the 24th of February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna, Trieste, and Naples.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60"
  }
];

// Keep track of shown books
let shownBooks = new Set();
let userInteractions = new Map(); // Map to store user interactions with timestamps

// Interaction weights for different actions
const interactionWeights = {
  like: 1.0,
  burn: -1.0,
  favorite: 2.0
};

// Initialize user preferences with timestamps
export const initializeUserPreferences = () => {
  const storedPrefs = localStorage.getItem('userPreferences');
  if (storedPrefs) {
    return JSON.parse(storedPrefs);
  }
  
  const preferences = {};
  books.forEach(book => {
    book.tags.forEach(tag => {
      preferences[tag] = {
        weight: 1,
        lastUpdated: Date.now()
      };
    });
  });
  
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
  return preferences;
};

// Calculate time decay
const calculateTimeDecay = (timestamp) => {
  const now = Date.now();
  const daysDiff = (now - timestamp) / (1000 * 60 * 60 * 24);
  return Math.pow(0.95, daysDiff); // 5% decay per day
};

// Update user preferences based on action
export const updateUserPreferences = (bookId, action) => {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const preferences = initializeUserPreferences();
  const weight = interactionWeights[action] || 0;
  const now = Date.now();

  // Update tag weights with time decay
  book.tags.forEach(tag => {
    const currentPref = preferences[tag] || { weight: 1, lastUpdated: now };
    const timeDecay = calculateTimeDecay(currentPref.lastUpdated);
    
    preferences[tag] = {
      weight: Math.max(0, Math.min(2, currentPref.weight * timeDecay + weight)),
      lastUpdated: now
    };
  });

  // Store interaction
  const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
  interactions.push({
    bookId,
    action,
    timestamp: now
  });
  localStorage.setItem('userInteractions', JSON.stringify(interactions));

  // Add to shown books
  shownBooks.add(bookId);
  if (shownBooks.size === books.length) {
    shownBooks.clear();
  }

  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Calculate book score based on user preferences and novelty
const calculateBookScore = (book, preferences) => {
  if (!book || !preferences) return 0;

  let score = 0;
  let totalWeight = 0;

  // Calculate preference score
  book.tags.forEach(tag => {
    if (preferences[tag]) {
      const timeDecay = calculateTimeDecay(preferences[tag].lastUpdated);
      score += preferences[tag].weight * timeDecay;
      totalWeight += 1;
    }
  });

  // Normalize score
  score = totalWeight > 0 ? score / totalWeight : 0;

  // Add novelty bonus if not shown recently
  if (!shownBooks.has(book.id)) {
    score += 0.2;
  }

  return score;
};

// Get book recommendations based on user preferences and genre filter
export const getRecommendations = (page = 1, limit = 10, selectedGenre = 'all') => {
  const preferences = initializeUserPreferences();
  
  // Filter and score books
  let availableBooks = books
    .filter(book => selectedGenre === 'all' || book.tags.includes(selectedGenre))
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences)
    }))
    .sort((a, b) => b.score - a.score);

  // If all books have been shown, reset
  if (availableBooks.length === shownBooks.size) {
    shownBooks.clear();
  }

  return availableBooks.slice((page - 1) * limit, page * limit);
};

// Get next recommended book
export const getNextRecommendation = (currentBookId) => {
  // Mark current book as shown
  if (currentBookId) {
    shownBooks.add(currentBookId);
  }

  const preferences = initializeUserPreferences();
  
  // Get all unshown books and score them
  const availableBooks = books
    .filter(book => !shownBooks.has(book.id))
    .map(book => ({
      ...book,
      score: calculateBookScore(book, preferences)
    }))
    .sort((a, b) => b.score - a.score);

  // If no more unshown books, reset and try again
  if (availableBooks.length === 0) {
    shownBooks.clear();
    return getNextRecommendation();
  }

  return availableBooks[0];
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
