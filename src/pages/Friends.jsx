
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import FilterBar from '@/components/friends/FilterBar';
import ViewControls from '@/components/friends/ViewControls';
import FriendCard from '@/components/friends/FriendCard';
import UnauthorizedView from '@/components/friends/UnauthorizedView';
import AdminControls from '@/components/friends/AdminControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle } from 'lucide-react';
import Messages from './Messages';
import { useUser } from '@/contexts/UserContext';

const placeholderAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNNDAgMTgwQzQwIDE0MC4yMzUgNzIuMzU1IDEwOCAxMTIuMTIgMTA4SDE0MEMxNzkuNzY1IDEwOCAyMTIuMTIgMTQwLjIzNSAyMTIuMTIgMTgwSDQwWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==";

const Friends = () => {
  const { user, isAdmin, isAuthenticated } = useUser();
  const [friends] = useState([{
    id: 1,
    name: "Alice Johnson",
    avatar: placeholderAvatar,
    matchPercentage: 85,
    interests: ["Books", "Music", "Films"],
    isOnline: true
  }, {
    id: 2,
    name: "Bob Smith",
    avatar: placeholderAvatar,
    matchPercentage: 72,
    interests: ["Games", "Music"],
    isOnline: false
  }, {
    id: 3,
    name: "Carol Williams",
    avatar: placeholderAvatar,
    matchPercentage: 68,
    interests: ["Books", "Films"],
    isOnline: true
  }]);
  
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [matchFilter, setMatchFilter] = useState([0]);
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('match');
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated()) {
    return <UnauthorizedView />;
  }

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
        user.id, 
        selectedFriend.id,
        selectedFriend.name,
        selectedFriend.avatar
      );
      await api.sendMessage(conversation.id, message);
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedFriend.name}.`
      });
      
      setMessage('');
      setSelectedFriend(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleModerate = (action) => {
    toast({
      title: "Admin Action",
      description: `${action} functionality coming soon`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Friends & Messages</h1>
      
      {isAdmin() && <AdminControls onModerate={handleModerate} />}
      
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-red-600 hover:bg-red-500">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
            {filteredAndSortedFriends.map(friend => (
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
                handleViewProfile={() => {}}
                isAdmin={isAdmin()}
              />
            ))}
          </div>
          
          {filteredAndSortedFriends.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No friends match your current filters
              </p>
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
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <Messages />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Friends;
