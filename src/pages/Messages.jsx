
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.getConversations();
        setConversations(response);
        
        // If friendId is provided, find or create conversation with that friend
        if (friendId) {
          const existingConv = response.find(conv => 
            conv.participants.includes(Number(friendId))
          );
          
          if (existingConv) {
            setSelectedConversation(existingConv);
          } else {
            // Create new conversation with this friend
            const newConv = await api.createConversation(1, Number(friendId)); // Using 1 as dummy current user ID
            setConversations(prev => [...prev, newConv]);
            setSelectedConversation(newConv);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      }
    };

    fetchConversations();
  }, [friendId, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.sendMessage(selectedConversation.id, newMessage);
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, response]
      }));
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.map(conv => (
              <Button
                key={conv.id}
                className="w-full mb-2 justify-start"
                variant={selectedConversation?.id === conv.id ? "secondary" : "ghost"}
                onClick={() => setSelectedConversation(conv)}
              >
                {conv.friendName}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? `Chat with ${selectedConversation.friendName}` : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation && (
              <>
                <div className="h-64 overflow-y-auto mb-4">
                  {selectedConversation.messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {message.content}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow mr-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
