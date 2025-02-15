import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Timer, Flame, Clock, SortAsc, SortDesc } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
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
  const [viewMode, setViewMode] = useState(() => 
    localStorage.getItem('viewMode') || 'grid'
  );
  const [sortBy, setSortBy] = useState(() => 
    localStorage.getItem('sortBy') || 'date'
  );
  const [sortOrder, setSortOrder] = useState(() => 
    localStorage.getItem('sortOrder') || 'desc'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [minReadingTime, setMinReadingTime] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleShare = async (book) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}!`,
          url: `${window.location.origin}/book/${book.id}`
        });
        toast({
          title: "Shared Successfully!",
          description: `"${book.title}" has been shared.`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/book/${book.id}`);
        toast({
          title: "Share Link Copied!",
          description: `Share link for "${book.title}" has been copied to clipboard.`
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled share
        return;
      }
      toast({
        title: "Share Failed",
        description: "Could not share the book. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReread = (book) => {
    try {
      navigate(`/book/${book.id}`);
      toast({
        title: "Opening Book",
        description: `Opening "${book.title}" for re-reading.`
      });
    } catch (error) {
      toast({
        title: "Navigation Failed",
        description: "Could not open the book. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    toast({
      title: `View Changed`,
      description: `Switched to ${mode} view.`
    });
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      toast({
        title: "Sort Order Changed",
        description: `Sorted in ${newOrder}ending order.`
      });
      return newOrder;
    });
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    toast({
      title: "Sort Changed",
      description: `Sorted by ${value}.`
    });
  };

  const handleMinReadingTimeChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      toast({
        title: "Invalid Input",
        description: "Reading time cannot be negative.",
        variant: "destructive"
      });
      return;
    }
    setMinReadingTime(value);
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

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
    localStorage.setItem('sortBy', sortBy);
    localStorage.setItem('sortOrder', sortOrder);
  }, [viewMode, sortBy, sortOrder]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Recently Viewed Books</h1>
        <div className="flex items-center gap-4">
          <Card className="p-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange('grid')}
              className={`${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange('list')}
              className={`${viewMode === 'list' ? 'bg-primary/10' : ''}`}
              aria-label="List view"
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
          aria-label="Search books"
        />
        <Select value={sortBy} onValueChange={handleSortByChange}>
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
          onClick={handleSortOrderChange}
          aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
        <Input
          type="number"
          placeholder="Min reading time (minutes)"
          value={minReadingTime}
          onChange={handleMinReadingTimeChange}
          className="max-w-xs"
          min="0"
          aria-label="Minimum reading time in minutes"
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
