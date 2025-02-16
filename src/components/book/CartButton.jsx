
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CartButton = ({ onClick, isLoading }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            disabled={isLoading}
            className="w-full mt-4 h-12 sm:h-14 rounded-xl touch-manipulation
              bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
              active:scale-95 transition-transform"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span className="text-sm sm:text-base font-medium">Add to Cart</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to cart allows you to purchase a book, adds it to your favorites and boosts similar books</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CartButton;
