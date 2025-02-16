
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

const ShoppingCart = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    setIsLoading(true);
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(bookId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book_id'
        });

      if (error) throw error;

      // Update local state after successful backend update
      updateQuantity(bookId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (bookId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', bookId);

      if (error) throw error;

      // Update local state after successful backend deletion
      removeFromCart(bookId);
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Verify cart contents with backend before proceeding
      const { data: serverCart, error } = await supabase
        .from('cart_items')
        .select('book_id, quantity')
        .eq('user_id', user.id);

      if (error) throw error;

      // Compare server cart with local cart
      const cartMismatch = cart.some(item => {
        const serverItem = serverCart.find(si => si.book_id === item.id);
        return !serverItem || serverItem.quantity !== item.quantity;
      });

      if (cartMismatch) {
        toast({
          variant: "destructive",
          title: "Cart Sync Error",
          description: "Your cart has been modified. Please refresh the page."
        });
        return;
      }

      onClose();
      navigate('/checkout');
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process checkout. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p>Please log in to view your cart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center my-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    ${(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;
