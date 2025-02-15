
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Timer, Flame, Clock, SortAsc, SortDesc } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';
import ReadingStreak from '@/components/reading/ReadingStreak';
import AchievementCard from '@/components/reading/AchievementCard';
import TimelineCard from '@/components/reading/TimelineCard';
import StatsCard from '@/components/reading/StatsCard';
import BookList from '@/components/reading/BookList';
import ReadingLevel from '@/components/reading/ReadingLevel';
import { calculateMilestone } from '@/utils/gamification';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const filterAndSortBooks = (books) => {
    let filteredBooks = [...books];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    // Apply reading time filter
    filteredBooks = filteredBooks.filter(book => book.timeSpent >= minReadingTime);

    // Apply sorting
    filteredBooks.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.viewedAt) - new Date(a.viewedAt);
          break;
        case 'time':
          comparison = b.timeSpent - a.timeSpent;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filteredBooks;
  };

  const groupedBooks = filterAndSortBooks(recentBooks).reduce((groups, book) => {
    const now = new Date();
    const viewDate = new Date(book.viewedAt);
    const dayDiff = Math.floor((now - viewDate) / (1000 * 60 * 60 * 24));

    let group = 'Earlier';
    if (dayDiff === 0) group = 'Today';
    else if (dayDiff === 1) group = 'Yesterday';
    else if (dayDiff < 7) group = 'This Week';

    if (!groups[group]) groups[group] = [];
    groups[group].push(book);
    return groups;
  }, {});

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Recently Viewed Books</h1>
        <div className="flex items-center gap-4">
          <Card className="p-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`${viewMode === 'list' ? 'bg-primary/10' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="time">Reading Time</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
        <Input
          type="number"
          placeholder="Min reading time (minutes)"
          value={minReadingTime}
          onChange={(e) => setMinReadingTime(Number(e.target.value))}
          className="max-w-xs"
        />
      </div>

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
