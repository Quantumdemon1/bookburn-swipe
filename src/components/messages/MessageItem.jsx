
import React from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Laugh, MoreHorizontal, Reply, Forward, Trash2, Check, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MessageItem = ({ message, onReaction }) => {
  const getMessageStatus = (message) => {
    if (!message) return null;
    if (message.read) return <CheckCheck className="h-4 w-4 text-blue-500" />;
    if (message.delivered) return <Check className="h-4 w-4 text-blue-500" />;
    return <Check className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div 
      className={`group flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
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
                  onClick={() => onReaction(message.id, 'heart')}
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
                  onClick={() => onReaction(message.id, 'thumbsUp')}
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
                  onClick={() => onReaction(message.id, 'laugh')}
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
};

export default MessageItem;
