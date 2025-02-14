
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ 
  conversations, 
  searchQuery, 
  onSearchChange, 
  selectedConversation,
  pinnedConversations,
  onSelectConversation,
  onPinConversation 
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <div className="space-y-4">
          <CardTitle>Conversations</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={onSearchChange}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {conversations.map(conv => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedConversation?.id === conv.id}
              isPinned={pinnedConversations.includes(conv.id)}
              onSelect={onSelectConversation}
              onPin={onPinConversation}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
