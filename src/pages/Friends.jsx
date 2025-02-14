
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import FilterBar from '@/components/friends/FilterBar';
import ViewControls from '@/components/friends/ViewControls';
import FriendCard from '@/components/friends/FriendCard';

const Friends = () => {
  const [friends] = useState([
    { 
      id: 1, 
      name: "Alice Johnson", 
      avatar: "/placeholder.svg", 
      matchPercentage: 85,
      interests: ["Books", "Music", "Films"],
      isOnline: true
    },
    { 
      id: 2, 
      name: "Bob Smith", 
      avatar: "/placeholder.svg", 
      matchPercentage: 72,
      interests: ["Games", "Music"],
      isOnline: false
    },
    { 
      id: 3, 
      name: "Carol Williams", 
      avatar: "/placeholder.svg", 
      matchPercentage: 68,
      interests: ["Books", "Films"],
      isOnline: true
    },
  ]);
  
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [matchFilter, setMatchFilter] = useState([0]);
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('match');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredAndSortedFriends = friends
    .filter(friend => 
      friend.matchPercentage >= matchFilter[0] &&
      (selectedInterest === "all" || friend.interests.includes(selectedInterest))
    )
    .sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.name.localeCompare(b.name);
    });

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriend) return;

    try {
      const conversation = await api.createConversation(
        1,
        selectedFriend.id,
        selectedFriend.name,
        selectedFriend.avatar
      );
      
      await api.sendMessage(conversation.id, message);
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedFriend.name}.`,
      });
      
      setMessage('');
      setSelectedFriend(null);
      navigate('/messages');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (friend) => {
    navigate(`/messages?friend=${friend.id}&name=${encodeURIComponent(friend.name)}&avatar=${encodeURIComponent(friend.avatar)}`);
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Friends with Similar Tastes</h1>
        <div className="flex flex-wrap gap-4">
          <FilterBar
            matchFilter={matchFilter}
            setMatchFilter={setMatchFilter}
            selectedInterest={selectedInterest}
            setSelectedInterest={setSelectedInterest}
          />
          <ViewControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      </div>
      
      <div className={`
        grid gap-4 animate-fade-in
        ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}
      `}>
        {filteredAndSortedFriends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            viewMode={viewMode}
            selectedInterest={selectedInterest}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleViewProfile={handleViewProfile}
          />
        ))}
      </div>
      
      {filteredAndSortedFriends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No friends match your current filters</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setMatchFilter([0]);
              setSelectedInterest("all");
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Friends;
