
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import ConversationList from '@/components/messages/ConversationList';
import MessageItem from '@/components/messages/MessageItem';
import MessageInput from '@/components/messages/MessageInput';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageList from '@/components/messages/MessageList';
import { useMessages } from '@/hooks/useMessages';

const Messages = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    searchQuery,
    setSearchQuery,
    pinnedConversations,
    messageSearch,
    setMessageSearch,
    showSearch,
    setShowSearch,
    handleSendMessage,
    togglePinConversation
  } = useMessages();

  const [isRecording, setIsRecording] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

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

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Coming Soon",
        description: "Voice recording feature will be available soon!",
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
                  <MessageList
                    messages={selectedConversation.messages}
                    onReaction={handleReaction}
                    messageSearch={messageSearch}
                  />
                </div>
                <MessageInput
                  newMessage={newMessage}
                  onMessageChange={(e) => setNewMessage(e.target.value)}
                  onSend={() => {
                    handleSendMessage(newMessage);
                    setNewMessage('');
                  }}
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
