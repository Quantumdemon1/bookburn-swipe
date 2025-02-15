
import { useMemo } from 'react';

export const useConversationSorting = (conversations, searchQuery, pinnedConversations) => {
  return useMemo(() => {
    const filteredConversations = conversations.filter(conv => {
      const searchLower = searchQuery.toLowerCase();
      return (
        conv.friendName?.toLowerCase().includes(searchLower) ||
        conv.messages?.some(msg => msg.content.toLowerCase().includes(searchLower))
      );
    });

    return [...filteredConversations].sort((a, b) => {
      const aPinned = pinnedConversations.includes(a.id);
      const bPinned = pinnedConversations.includes(b.id);
      if (aPinned !== bPinned) return bPinned ? 1 : -1;
      
      const aLastMessage = a.messages?.[a.messages.length - 1];
      const bLastMessage = b.messages?.[b.messages.length - 1];
      return new Date(bLastMessage?.timestamp || 0) - new Date(aLastMessage?.timestamp || 0);
    });
  }, [conversations, searchQuery, pinnedConversations]);
};
