import { supabase, safeOperation, isValidUUID } from '@/lib/supabaseClient';
import { calculateBookScore } from './bookScoring';

const ALGORITHM_VERSION = '1.0.0';

export const initializeMatchingPreferences = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  if (!isValidUUID(userId)) return null;

  try {
    const { data: existingPrefs } = await safeOperation(() =>
      supabase
        .from('matching_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
    );

    if (existingPrefs) return existingPrefs;

    const defaultPrefs = {
      genre_weights: {},
      author_weights: {},
      min_rating: 3,
      max_price: 100
    };

    const { data: newPrefs, error } = await safeOperation(() =>
      supabase
        .from('matching_preferences')
        .insert({
          user_id: userId,
          ...defaultPrefs
        })
        .select()
        .single()
    );

    if (error) throw error;
    return newPrefs;
  } catch (error) {
    console.error('Error initializing matching preferences:', error);
    throw error;
  }
};

export const updateMatchHistory = async (userId, matchResult) => {
  if (!isValidUUID(userId)) return null;

  try {
    const { data: history } = await safeOperation(() =>
      supabase
        .from('match_history')
        .select('*')
        .eq('user_id', userId)
        .eq('algorithm_version', ALGORITHM_VERSION)
        .maybeSingle()
    );

    const updates = {
      user_id: userId,
      algorithm_version: ALGORITHM_VERSION,
      total_matches: (history?.total_matches || 0) + 1,
      positive_responses: (history?.positive_responses || 0) + (matchResult ? 1 : 0)
    };

    updates.success_rate = updates.positive_responses / updates.total_matches;

    await safeOperation(() =>
      supabase
        .from('match_history')
        .upsert(updates)
    );
  } catch (error) {
    console.error('Error updating match history:', error);
  }
};

export const recordBookMatch = async (userId, bookId, matchScore, userResponse = null) => {
  if (!isValidUUID(userId)) return null;

  try {
    const { error } = await safeOperation(() =>
      supabase
        .from('book_matches')
        .insert({
          user_id: userId,
          book_id: bookId,
          match_score: matchScore,
          user_response: userResponse,
          response_timestamp: userResponse ? new Date().toISOString() : null
        })
    );

    if (error) throw error;

    if (userResponse) {
      await updateMatchHistory(userId, userResponse === 'like' || userResponse === 'favorite');
    }
  } catch (error) {
    console.error('Error recording book match:', error);
    throw error;
  }
};

export const getNextMatch = async (userId) => {
  try {
    if (!isValidUUID(userId)) {
      // Return mock data for demo users
      return {
        id: 'demo-1',
        title: 'Sample Book',
        author: 'Demo Author',
        matchScore: 0.85
      };
    }

    // Initialize preferences if they don't exist
    const preferences = await initializeMatchingPreferences(userId);
    if (!preferences) {
      throw new Error('Failed to initialize matching preferences');
    }

    // Get books
    const { data: books } = await safeOperation(() =>
      supabase.rpc('get_books_with_ratings')
    );

    // Get previously shown books
    const { data: shownBooks } = await safeOperation(() =>
      supabase
        .from('book_matches')
        .select('book_id')
        .eq('user_id', userId)
    );

    const shownBookIds = new Set(shownBooks?.map(match => match.book_id) || []);

    // Filter books based on preferences and previously shown
    const availableBooks = books?.filter(book => {
      // Skip already shown books
      if (shownBookIds.has(book.id)) return false;

      // Apply min_rating filter if set
      if (preferences?.min_rating && book.avg_rating < preferences.min_rating) {
        return false;
      }

      // Apply max_price filter if set
      if (preferences?.max_price && book.price > preferences.max_price) {
        return false;
      }

      return true;
    }) || [];

    if (availableBooks.length === 0) return null;

    // Score and sort filtered books
    const scoredBooks = availableBooks.map(book => ({
      ...book,
      matchScore: calculateBookScore(book, preferences)
    }));

    scoredBooks.sort((a, b) => b.matchScore - a.matchScore);
    const nextBook = scoredBooks[0];

    // Record the match
    await recordBookMatch(userId, nextBook.id, nextBook.matchScore);
    return nextBook;
  } catch (error) {
    console.error('Error getting next match:', error);
    throw error;
  }
};