
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';
import { useSearchParams } from 'react-router-dom';

export const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');
  const [typingStatus, setTypingStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedConversations, setPinnedConversations] = useState([]);
  const [messageSearch, setMessageSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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

  const handleSendMessage = async (message) => {
    if (!message.trim() || !selectedConversation) return;

    try {
      const response = await api.sendMessage(selectedConversation.id, message);
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), response]
      }));
      
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

  const togglePinConversation = (convId) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(prev => prev.filter(id => id !== convId));
    } else {
      setPinnedConversations(prev => [...prev, convId]);
    }
  };

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    typingStatus,
    searchQuery,
    setSearchQuery,
    pinnedConversations,
    messageSearch,
    setMessageSearch,
    showSearch,
    setShowSearch,
    handleSendMessage,
    togglePinConversation
  };
};
