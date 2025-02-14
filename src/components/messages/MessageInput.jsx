
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Paperclip, Mic, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MessageInput = ({
  newMessage,
  onMessageChange,
  onSend,
  onAttachment,
  onVoiceRecord,
  isRecording,
  attachmentPreview,
  onRemoveAttachment,
  onEmojiClick
}) => {
  return (
    <div className="space-y-4 pt-2 border-t">
      {attachmentPreview && (
        <div className="relative inline-block">
          <div className="relative group border rounded-lg p-2 inline-block">
            {attachmentPreview.type === 'image' && (
              <img 
                src={attachmentPreview.url} 
                alt="Preview" 
                className="max-h-32 rounded"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background shadow-sm"
              onClick={onRemoveAttachment}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <Input
            value={newMessage}
            onChange={onMessageChange}
            placeholder="Type a message..."
            className="min-h-[2.5rem]"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onEmojiClick}>
                  <Smile className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onAttachment}>
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onVoiceRecord}>
                  <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRecording ? 'Stop recording' : 'Record voice message'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={onSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
