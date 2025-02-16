
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isClicked, 
  color, 
  animation,
  isLoading,
  isRetrying 
}) => {
  return (
    <motion.div
      animate={isClicked ? animation : {}}
      className="flex-1"
    >
      <Button
        variant="ghost"
        size="lg"
        onClick={onClick}
        disabled={isLoading}
        className={`w-full h-14 sm:h-16 rounded-xl touch-manipulation 
          active:scale-95 transition-transform
          flex flex-col items-center justify-center
          space-y-1`}
      >
        {isRetrying ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6`} style={{ color: color }} />
            <span className="text-xs sm:text-sm font-medium" style={{ color: color }}>{label}</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default ActionButton;
