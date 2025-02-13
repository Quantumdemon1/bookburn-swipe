
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

const Friends = () => {
  const [friends] = useState([
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg", matchPercentage: 85 },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg", matchPercentage: 72 },
    { id: 3, name: "Carol Williams", avatar: "/placeholder.svg", matchPercentage: 68 },
  ]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriend) return;

    try {
      // Create a new conversation if it doesn't exist
      const conversation = await api.createConversation(
        1, // Using 1 as dummy current user ID
        selectedFriend.id,
        selectedFriend.name,
        selectedFriend.avatar
      );
      
      // Send the message
      await api.sendMessage(conversation.id, message);
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedFriend.name}.`,
      });
      
      setMessage('');
      setSelectedFriend(null);
      
      // Navigate to messages page
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
    // Navigate to messages with this friend's full profile
    navigate(`/messages?friend=${friend.id}&name=${encodeURIComponent(friend.name)}&avatar=${encodeURIComponent(friend.avatar)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Friends with Similar Tastes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <Card key={friend.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{friend.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{friend.matchPercentage}% Match</p>
              <div className="flex space-x-2 mt-4">
                <Button 
                  className="flex-1" 
                  onClick={() => handleViewProfile(friend)}
                >
                  View Profile
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1" onClick={() => setSelectedFriend(friend)}>
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
    </div>
  );
};

export default Friends;
