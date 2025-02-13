import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { 
  Check, 
  CheckCheck, 
  MoreHorizontal, 
  Smile, 
  Reply, 
  Trash2, 
  Forward, 
  Heart, 
  ThumbsUp, 
  Laugh,
  Search,
  Pin,
  Paperclip,
  Image as ImageIcon,
  Mic
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');
  const [typingStatus, setTypingStatus] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedConversations, setPinnedConversations] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.getConversations();
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
            const friendName = searchParams.get('name');
            const friendAvatar = searchParams.get('avatar');
            const newConv = await api.createConversation(
              1, // dummy current user ID
              Number(friendId),
              friendName,
              friendAvatar
            );
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
  }, [friendId, toast, searchParams]);

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.friendName?.toLowerCase().includes(searchLower) ||
      conv.messages?.some(msg => msg.content.toLowerCase().includes(searchLower))
    );
  });

  const togglePinConversation = (convId) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(prev => prev.filter(id => id !== convId));
    } else {
      setPinnedConversations(prev => [...prev, convId]);
    }
  };

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aPinned = pinnedConversations.includes(a.id);
    const bPinned = pinnedConversations.includes(b.id);
    if (aPinned !== bPinned) return bPinned ? 1 : -1;
    
    const aLastMessage = a.messages?.[a.messages.length - 1];
    const bLastMessage = b.messages?.[b.messages.length - 1];
    return new Date(bLastMessage?.timestamp || 0) - new Date(aLastMessage?.timestamp || 0);
  });

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        toast({
          title: "Coming Soon",
          description: "File attachment feature will be available soon!",
        });
      }
    };
    input.click();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Coming Soon",
        description: "Voice recording feature will be available soon!",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.sendMessage(selectedConversation.id, newMessage);
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), response]
      }));
      setNewMessage('');
      
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

  const handleReaction = async (messageId, reaction) => {
    try {
      await api.addMessageReaction(messageId, reaction);
      setSelectedConversation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
            : msg
        )
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive",
      });
    }
  };

  const renderDateSeparator = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  };

  const renderMessages = () => {
    if (!selectedConversation?.messages?.length) return null;

    let currentDate = null;
    return selectedConversation.messages.map((message, index) => {
      const messageDate = new Date(message.timestamp);
      const showDateSeparator = !currentDate || !isSameDay(currentDate, messageDate);
      
      if (showDateSeparator) {
        currentDate = messageDate;
        return (
          <React.Fragment key={message.id}>
            <div className="flex justify-center my-4">
              <span className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                {renderDateSeparator(messageDate)}
              </span>
            </div>
            {renderMessage(message)}
          </React.Fragment>
        );
      }
      
      return renderMessage(message);
    });
  };

  const renderMessage = (message) => (
    <div 
      key={message.id} 
      className={`group flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
      onMouseEnter={() => setSelectedMessage(message.id)}
      onMouseLeave={() => setSelectedMessage(null)}
    >
      <div className={`max-w-[70%] break-words relative ${
        message.sender === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      } rounded-lg px-4 py-2`}>
        {message.content}
        
        <div className={`absolute ${message.sender === 'user' ? 'right-0' : 'left-0'} -top-8 
          opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => handleReaction(message.id, 'heart')}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>React with heart</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => handleReaction(message.id, 'thumbsUp')}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>React with thumbs up</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => handleReaction(message.id, 'laugh')}
                >
                  <Laugh className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>React with laugh</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Reply className="h-4 w-4 mr-2" /> Reply
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Forward className="h-4 w-4 mr-2" /> Forward
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="bg-background/80 rounded-full px-2 py-0.5 text-xs">
                {reaction === 'heart' && <Heart className="h-3 w-3 inline" />}
                {reaction === 'thumbsUp' && <ThumbsUp className="h-3 w-3 inline" />}
                {reaction === 'laugh' && <Laugh className="h-3 w-3 inline" />}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
        <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
        {message.sender === 'user' && getMessageStatus(message)}
      </div>
    </div>
  );

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
            <div className="space-y-4">
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {sortedConversations.map(conv => {
                const lastMessage = conv.messages?.[conv.messages.length - 1];
                const hasUnread = conv.messages?.some(m => !m.read && m.sender !== 'user') || false;
                const friendName = conv.friendName || 'User';
                const isTyping = typingStatus[conv.id];
                const isPinned = pinnedConversations.includes(conv.id);
                
                return (
                  <div key={conv.id} className="relative group">
                    <Button
                      className="w-full p-3 justify-start h-auto border-b hover:bg-gray-100 transition-colors"
                      variant="ghost"
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conv.friendAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{(friendName[0] || 'U').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conv.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
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
                          <p className="text-sm text-gray-500 truncate">
                            {isTyping ? (
                              <span className="text-primary animate-pulse">Typing...</span>
                            ) : (
                              lastMessage?.content
                            )}
                          </p>
                        </div>
                        {hasUnread && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${isPinned ? 'text-primary' : ''}`}
                      onClick={() => togglePinConversation(conv.id)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            {selectedConversation && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedConversation.friendAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {((selectedConversation.friendName || 'U')[0]).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{selectedConversation.friendName || 'User'}</CardTitle>
                    {selectedConversation.isOnline && (
                      <p className="text-sm text-muted-foreground">Online</p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => togglePinConversation(selectedConversation.id)}>
                      <Pin className="h-4 w-4 mr-2" />
                      {pinnedConversations.includes(selectedConversation.id) ? 'Unpin' : 'Pin'} Conversation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <>
                <div className="h-[calc(70vh-200px)] overflow-y-auto mb-4 p-4 space-y-4">
                  {renderMessages()}
                </div>
                <div className="flex items-end space-x-2 pt-2 border-t">
                  <div className="flex-grow">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-[2.5rem]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => toast({ description: "Emoji picker coming soon!" })}>
                            <Smile className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add emoji</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleAttachment}>
                            <Paperclip className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleVoiceRecord}>
                            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isRecording ? 'Stop recording' : 'Record voice message'}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
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
