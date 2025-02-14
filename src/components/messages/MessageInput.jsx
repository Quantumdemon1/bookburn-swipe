
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
        <div className="relative inline-block animate-scale-in">
          <div className="relative group border rounded-lg p-2 inline-block hover:bg-accent/50 transition-colors">
            {attachmentPreview.type === 'image' && (
              <img 
                src={attachmentPreview.url} 
                alt="Preview" 
                className="max-h-32 rounded transition-transform group-hover:scale-[1.02]"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={onRemoveAttachment}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-end space-x-2">
        <div className="flex-grow relative">
          <Input
            value={newMessage}
            onChange={onMessageChange}
            placeholder="Type a message..."
            className="min-h-[2.5rem] pr-24"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <div className="absolute right-2 bottom-1/2 translate-y-1/2 flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEmojiClick}>
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAttachment}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                    onClick={onVoiceRecord}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isRecording ? 'Stop recording' : 'Record voice message'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Button 
          onClick={onSend}
          className="transition-transform hover:scale-105 active:scale-95"
          disabled={!newMessage.trim() && !attachmentPreview}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
