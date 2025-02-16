
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useCartOperations } from '@/hooks/useCartOperations';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  
  const {
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart
  } = useCartOperations(user, setCart);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      if (user?.id) {
        await loadCart();
      } else {
        setCart([]);
      }
      setIsLoading(false);
    };

    initializeCart();
  }, [user, loadCart]);

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
