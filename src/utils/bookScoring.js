
import { calculateTimeDecay } from './preferencesManager';
import { isBookShown } from './preferencesManager';

// Calculate book score based on user preferences and novelty
export const calculateBookScore = (book, preferences) => {
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
  if (!isBookShown(book.id)) {
    score += 0.2;
  }

  return score;
};
