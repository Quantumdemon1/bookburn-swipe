import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ConversationList from '@/components/messages/ConversationList';
import MessageItem from '@/components/messages/MessageItem';
import MessageInput from '@/components/messages/MessageInput';
import ConversationHeader from '@/components/messages/ConversationHeader';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');
  const [typingStatus, setTypingStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedConversations, setPinnedConversations] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

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
        const previewUrl = URL.createObjectURL(file);
        setAttachmentPreview({
          type: 'image',
          url: previewUrl,
          name: file.name
        });
      }
    };
    input.click();
  };

  const removeAttachment = () => {
    if (attachmentPreview?.url) {
      URL.revokeObjectURL(attachmentPreview.url);
    }
    setAttachmentPreview(null);
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

  const togglePinConversation = (convId) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(prev => prev.filter(id => id !== convId));
    } else {
      setPinnedConversations(prev => [...prev, convId]);
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
            <MessageItem message={message} onReaction={handleReaction} />
          </React.Fragment>
        );
      }
      
      return <MessageItem key={message.id} message={message} onReaction={handleReaction} />;
    });
  };

  const filteredMessages = selectedConversation?.messages?.filter(
    message => message.content.toLowerCase().includes(messageSearch.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConversationList
          conversations={sortedConversations}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          selectedConversation={selectedConversation}
          pinnedConversations={pinnedConversations}
          onSelectConversation={setSelectedConversation}
          onPinConversation={togglePinConversation}
        />
        
        <Card className="md:col-span-2">
          <ConversationHeader
            conversation={selectedConversation}
            showSearch={showSearch}
            messageSearch={messageSearch}
            onSearchChange={(e) => setMessageSearch(e.target.value)}
            onToggleSearch={() => setShowSearch(!showSearch)}
            onPinConversation={togglePinConversation}
            isPinned={pinnedConversations.includes(selectedConversation?.id)}
          />
          <CardContent>
            {selectedConversation ? (
              <>
                <div className="h-[calc(70vh-200px)] overflow-y-auto mb-4 p-4 space-y-4">
                  {messageSearch ? (
                    filteredMessages.length > 0 ? (
                      filteredMessages.map(message => (
                        <MessageItem key={message.id} message={message} onReaction={handleReaction} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                        <MessageCircle className="h-12 w-12" />
                        <p>No messages found</p>
                      </div>
                    )
                  ) : (
                    renderMessages()
                  )}
                </div>
                <MessageInput
                  newMessage={newMessage}
                  onMessageChange={(e) => setNewMessage(e.target.value)}
                  onSend={handleSendMessage}
                  onAttachment={handleAttachment}
                  onVoiceRecord={handleVoiceRecord}
                  isRecording={isRecording}
                  attachmentPreview={attachmentPreview}
                  onRemoveAttachment={() => {
                    if (attachmentPreview?.url) {
                      URL.revokeObjectURL(attachmentPreview.url);
                    }
                    setAttachmentPreview(null);
                  }}
                  onEmojiClick={() => toast({ description: "Emoji picker coming soon!" })}
                />
              </>
            ) : (
              <div className="h-[calc(70vh-200px)] flex flex-col items-center justify-center text-gray-500 space-y-4">
                <MessageCircle className="h-16 w-16" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
