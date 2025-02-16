
import React from 'react';
import { Button } from "@/components/ui/button";

const ShareButtons = ({ onShare }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button type="button" variant="outline" size="sm" onClick={() => onShare('twitter')}>
        Share on Twitter
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onShare('facebook')}>
        Share on Facebook
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onShare('linkedin')}>
        Share on LinkedIn
      </Button>
    </div>
  );
};

export default ShareButtons;
