
import React from 'react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import MessageItem from './MessageItem';
import { MessageCircle } from 'lucide-react';

const MessageList = ({ messages, onReaction, messageSearch }) => {
  const renderDateSeparator = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  };

  const renderMessages = () => {
    if (!messages?.length) return null;

    let currentDate = null;
    return messages.map((message, index) => {
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
            <MessageItem message={message} onReaction={onReaction} />
          </React.Fragment>
        );
      }
      
      return <MessageItem key={message.id} message={message} onReaction={onReaction} />;
    });
  };

  const filteredMessages = messages?.filter(
    message => message.content.toLowerCase().includes(messageSearch.toLowerCase())
  ) || [];

  if (messageSearch) {
    return filteredMessages.length > 0 ? (
      filteredMessages.map(message => (
        <MessageItem key={message.id} message={message} onReaction={onReaction} />
      ))
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
        <MessageCircle className="h-12 w-12" />
        <p>No messages found</p>
      </div>
    );
  }

  return renderMessages();
};

export default MessageList;
