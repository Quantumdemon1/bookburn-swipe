
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const NextButton = ({ onClick, isLoading }) => {
  return (
    <div className="text-center mt-8">
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
    </div>
  );
};

export default NextButton;
