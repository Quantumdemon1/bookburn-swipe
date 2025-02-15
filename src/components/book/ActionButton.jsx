
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

const ActionButton = ({ 
  icon: Icon,
  label,
  onClick,
  isLoading,
  isRetrying,
  isClicked,
  color,
  animation
}) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        onClick={onClick}
        className={`rounded-full p-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isRetrying ? (
          <Loader className="h-8 w-8 animate-spin" />
        ) : (
          <motion.div 
            className={`text-${color}-500`}
            animate={isClicked ? animation : {}}
          >
            <Icon className={`h-8 w-8 text-${color}-500`} />
            <span className="text-xs block mt-1">{label}</span>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default ActionButton;
