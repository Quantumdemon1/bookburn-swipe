
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader } from "lucide-react";
import { motion } from "framer-motion";

const CartButton = ({ onClick, isLoading }) => {
  return (
    <motion.div
      className="mt-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        onClick={onClick}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        Add to Cart
      </Button>
    </motion.div>
  );
};

export default CartButton;
