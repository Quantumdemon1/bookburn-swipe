
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import ConversationList from '@/components/messages/ConversationList';
import MessageInput from '@/components/messages/MessageInput';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageList from '@/components/messages/MessageList';
import { useMessages } from '@/hooks/useMessages';
import { useConversationSorting } from '@/hooks/useConversationSorting';
import { useAttachmentHandler } from '@/hooks/useAttachmentHandler';

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

  const {
    attachmentPreview,
    isRecording,
    handleAttachment,
    handleVoiceRecord,
    removeAttachment
  } = useAttachmentHandler();

  const sortedConversations = useConversationSorting(
    conversations,
    searchQuery,
    pinnedConversations
  );

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
                  onRemoveAttachment={removeAttachment}
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
