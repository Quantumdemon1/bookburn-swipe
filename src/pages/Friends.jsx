
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Book, Music, Film, GamepadIcon } from 'lucide-react';

const Friends = () => {
  const [friends] = useState([
    { 
      id: 1, 
      name: "Alice Johnson", 
      avatar: "/placeholder.svg", 
      matchPercentage: 85,
      interests: ["Books", "Music", "Films"]
    },
    { 
      id: 2, 
      name: "Bob Smith", 
      avatar: "/placeholder.svg", 
      matchPercentage: 72,
      interests: ["Games", "Music"]
    },
    { 
      id: 3, 
      name: "Carol Williams", 
      avatar: "/placeholder.svg", 
      matchPercentage: 68,
      interests: ["Books", "Films"]
    },
  ]);
  
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [matchFilter, setMatchFilter] = useState([0]);
  const [selectedInterest, setSelectedInterest] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const interestIcons = {
    Books: Book,
    Music: Music,
    Films: Film,
    Games: GamepadIcon,
  };

  const filteredFriends = friends.filter(friend => 
    friend.matchPercentage >= matchFilter[0] &&
    (selectedInterest === "all" || friend.interests.includes(selectedInterest))
  );

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Friends with Similar Tastes</h1>
        <Card className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Match %</span>
          </div>
          <Slider
            value={matchFilter}
            onValueChange={setMatchFilter}
            max={100}
            step={5}
            className="w-32"
          />
          <span className="text-sm font-medium min-w-[3rem]">{matchFilter}%+</span>
          <Select value={selectedInterest} onValueChange={setSelectedInterest}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Interests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interests</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Films">Films</SelectItem>
              <SelectItem value="Games">Games</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFriends.map((friend) => (
          <Card key={friend.id} className="group hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>{friend.name}</CardTitle>
                  <div className="flex gap-1">
                    {friend.interests.map((interest) => {
                      const Icon = interestIcons[interest];
                      return (
                        <span 
                          key={interest}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                            ${selectedInterest === interest ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                            transition-colors duration-200`}
                        >
                          {Icon && <Icon className="h-3 w-3" />}
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Match</span>
                  <span className="text-lg font-bold text-primary">{friend.matchPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${friend.matchPercentage}%` }}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 group-hover:bg-primary/90 transition-colors"
                  onClick={() => handleViewProfile(friend)}
                >
                  View Profile
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1 group-hover:bg-primary/90 transition-colors"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to {selectedFriend?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                      />
                      <Button onClick={handleSendMessage}>Send</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredFriends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No friends match your current filters</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setMatchFilter([0]);
              setSelectedInterest("");
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
