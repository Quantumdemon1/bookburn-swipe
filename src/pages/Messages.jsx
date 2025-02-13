
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

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
        // Sort conversations by latest message
        const sortedConversations = response.sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          return new Date(bLastMessage?.timestamp || 0) - new Date(aLastMessage?.timestamp || 0);
        });
        setConversations(sortedConversations);
        
        if (friendId) {
          const existingConv = sortedConversations.find(conv => 
            conv.participants.includes(Number(friendId))
          );
          
          if (existingConv) {
            setSelectedConversation(existingConv);
          } else {
            const newConv = await api.createConversation(1, Number(friendId));
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
        messages: [...(prev?.messages || []), response]
      }));
      setNewMessage('');
      
      // Update conversation list to show latest message
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, messages: [...(conv.messages || []), response] }
            : conv
        );
        return updated.sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          return new Date(bLastMessage?.timestamp || 0) - new Date(aLastMessage?.timestamp || 0);
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getMessageStatus = (message) => {
    if (!message) return null;
    if (message.read) return <CheckCheck className="h-4 w-4 text-blue-500" />;
    if (message.delivered) return <Check className="h-4 w-4 text-blue-500" />;
    return <Check className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {conversations.map(conv => {
                const lastMessage = conv.messages?.[conv.messages.length - 1];
                const hasUnread = conv.messages?.some(m => !m.read && m.sender !== 'user') || false;
                const friendName = conv.friendName || 'User';
                
                return (
                  <Button
                    key={conv.id}
                    className="w-full p-3 justify-start h-auto border-b hover:bg-gray-100 transition-colors"
                    variant="ghost"
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <Avatar>
                        <AvatarImage src={conv.friendAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{(friendName[0] || 'U').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${hasUnread ? 'text-primary' : ''}`}>
                            {friendName}
                          </span>
                          {lastMessage && (
                            <span className="text-xs text-gray-500">
                              {format(new Date(lastMessage.timestamp), 'HH:mm')}
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            {selectedConversation && (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.friendAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{((selectedConversation.friendName || 'U')[0]).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle>{selectedConversation.friendName || 'User'}</CardTitle>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <>
                <div className="h-[calc(70vh-200px)] overflow-y-auto mb-4 p-4 space-y-4">
                  {(selectedConversation.messages || []).map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[70%] break-words ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      } rounded-lg px-4 py-2`}>
                        {message.content}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                        {message.sender === 'user' && getMessageStatus(message)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </>
            ) : (
              <div className="h-[calc(70vh-200px)] flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
