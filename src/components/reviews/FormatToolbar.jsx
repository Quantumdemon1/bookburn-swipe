
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

const FormatToolbar = ({ onFormatClick }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('underline')}>
        <Underline className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('list')}>
        <List className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('ordered-list')}>
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onFormatClick('link')}>
        <LinkIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FormatToolbar;
