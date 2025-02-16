
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NextButton = ({ onClick, isLoading }) => {
  return (
    <div className="text-center mt-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onClick}
              variant="outline"
              className="hover:scale-105 transition-transform"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : "Next Book"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Book allows you to skip a book and does not influence your recommendations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NextButton;
