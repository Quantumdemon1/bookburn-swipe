
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pin, Trash2, Search } from 'lucide-react';
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

const ConversationHeader = ({
  conversation,
  showSearch,
  messageSearch,
  onSearchChange,
  onToggleSearch,
  onPinConversation,
  isPinned
}) => {
  if (!conversation) return null;

  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={conversation.friendAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {((conversation.friendName || 'U')[0]).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <CardTitle>{conversation.friendName || 'User'}</CardTitle>
            {conversation.isOnline && (
              <p className="text-sm text-muted-foreground">Online</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onToggleSearch}
                  className={showSearch ? 'bg

-muted' : ''}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search in conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPinConversation(conversation.id)}>
                <Pin className="h-4 w-4 mr-2" />
                {isPinned ? 'Unpin' : 'Pin'} Conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showSearch && (
        <div className="mt-4 relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search in conversation..."
            value={messageSearch}
            onChange={onSearchChange}
            className="pl-8"
          />
        </div>
      )}
    </CardHeader>
  );
};

export default ConversationHeader;
