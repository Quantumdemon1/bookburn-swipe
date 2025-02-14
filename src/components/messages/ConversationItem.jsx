
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin } from 'lucide-react';
import { format } from 'date-fns';

const ConversationItem = ({ 
  conversation, 
  isSelected, 
  isPinned, 
  onSelect, 
  onPin 
}) => {
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
  const hasUnread = conversation.messages?.some(m => !m.read && m.sender !== 'user') || false;
  const friendName = conversation.friendName || 'User';
  const isTyping = conversation.isTyping;

  return (
    <div className="relative group animate-fade-in">
      <Button
        className={`w-full p-3 justify-start h-auto border-b hover:bg-accent transition-colors ${
          isSelected ? 'bg-accent' : ''
        }`}
        variant="ghost"
        onClick={() => onSelect(conversation)}
      >
        <div className="flex items-start space-x-3 w-full">
          <div className="relative">
            <Avatar className="transition-transform group-hover:scale-105">
              <AvatarImage src={conversation.friendAvatar || "/placeholder.svg"} />
              <AvatarFallback>{(friendName[0] || 'U').toUpperCase()}</AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className={`font-medium ${hasUnread ? 'text-primary' : ''}`}>
                {friendName}
              </span>
              {lastMessage && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(lastMessage.timestamp), 'HH:mm')}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {isTyping ? (
                <span className="text-primary animate-pulse">Typing...</span>
              ) : (
                lastMessage?.content
              )}
            </p>
          </div>
          {hasUnread && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent ${
          isPinned ? 'text-primary hover:text-primary' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onPin(conversation.id);
        }}
      >
        <Pin className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConversationItem;
