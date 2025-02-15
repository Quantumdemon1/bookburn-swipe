
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';
import ReadingStreak from '@/components/reading/ReadingStreak';
import AchievementCard from '@/components/reading/AchievementCard';
import TimelineCard from '@/components/reading/TimelineCard';
import StatsCard from '@/components/reading/StatsCard';
import BookList from '@/components/reading/BookList';
import ReadingLevel from '@/components/reading/ReadingLevel';
import { calculateMilestone } from '@/utils/gamification';
import RecentControls from '@/components/reading/RecentControls';
import { useBookFiltering } from '@/hooks/useBookFiltering';

const Recent = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [minReadingTime, setMinReadingTime] = useState(0);
  const { toast } = useToast();
  
  const recentBooks = [
    { 
      id: 1, 
      title: "Pride and Prejudice", 
      author: "Jane Austen", 
      liked: true,
      viewedAt: new Date('2024-03-14T10:00:00'),
      timeSpent: 45
    },
    { 
      id: 2, 
      title: "The Catcher in the Rye", 
      author: "J.D. Salinger", 
      liked: false,
      viewedAt: new Date('2024-03-13T15:30:00'),
      timeSpent: 30
    },
    { 
      id: 3, 
      title: "The Hobbit", 
      author: "J.R.R. Tolkien", 
      liked: true,
      viewedAt: new Date('2024-03-10T09:15:00'),
      timeSpent: 60
    },
  ];

  const groupedBooks = useBookFiltering(recentBooks, searchQuery, minReadingTime, sortBy, sortOrder);

  const handleShare = (book) => {
    toast({
      title: "Share Link Copied!",
      description: `Share link for "${book.title}" has been copied to clipboard.`
    });
  };

  const handleReread = (book) => {
    toast({
      title: "Opening Book",
      description: `Opening "${book.title}" for re-reading.`
    });
  };

  const totalTimeSpent = recentBooks.reduce((total, book) => total + book.timeSpent, 0);
  const averageTimePerBook = Math.round(totalTimeSpent / recentBooks.length);

  const streakDays = 3;
  const dailyReadingGoal = 30;
  const todayProgress = recentBooks
    .filter(book => {
      const today = new Date();
      const bookDate = new Date(book.viewedAt);
      return bookDate.toDateString() === today.toDateString();
    })
    .reduce((total, book) => total + book.timeSpent, 0);

  const achievements = [
    {
      id: 1,
      title: "Night Owl",
      description: "Read after 10 PM",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      earned: true
    },
    {
      id: 2,
      title: "Bookworm",
      description: "Read 3 days in a row",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      earned: true
    },
    {
      id: 3,
      title: "Speed Reader",
      description: "Finish a book in under an hour",
      icon: <Timer className="h-5 w-5 text-blue-500" />,
      earned: false
    }
  ];

  const readingHours = [
    { hour: '6AM-9AM', percentage: 15 },
    { hour: '9AM-12PM', percentage: 25 },
    { hour: '12PM-3PM', percentage: 10 },
    { hour: '3PM-6PM', percentage: 30 },
    { hour: '6PM-9PM', percentage: 15 },
    { hour: '9PM-12AM', percentage: 5 }
  ];

  useEffect(() => {
    const milestone = calculateMilestone(totalTimeSpent);
    if (milestone === totalTimeSpent) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Reading Milestone Achieved! 🎉",
        description: `You've reached ${milestone} minutes of reading time!`
      });
    }
  }, [totalTimeSpent, toast]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <RecentControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        minReadingTime={minReadingTime}
        setMinReadingTime={setMinReadingTime}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <ReadingStreak
          streakDays={streakDays}
          todayProgress={todayProgress}
          dailyReadingGoal={dailyReadingGoal}
        />
        <ReadingLevel totalMinutes={totalTimeSpent} />
        <AchievementCard achievements={achievements} />
      </div>

      <TimelineCard readingHours={readingHours} />

      <StatsCard
        booksCount={recentBooks.length}
        totalTime={totalTimeSpent}
        averageTime={averageTimePerBook}
      />

      {Object.entries(groupedBooks).map(([group, books]) => (
        <BookList
          key={group}
          group={group}
          books={books}
          viewMode={viewMode}
          onReread={handleReread}
          onShare={handleShare}
        />
      ))}
    </div>
  );
};

export default Recent;
