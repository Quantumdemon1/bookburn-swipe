import React, { useState, useEffect } from 'react';
import { Menu, BookOpen, ShoppingCart as CartIcon, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from '../nav-items';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ShoppingCart from './ShoppingCart';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Layout = ({ children }) => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-red-600 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">Book Burn</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <CartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription>
                  Review your items before checkout
                </SheetDescription>
              </SheetHeader>
              <ShoppingCart onClose={() => setIsCartOpen(false)} />
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {navItems.map(({ title, to, icon }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link to={to} className="flex items-center">
                    {icon}
                    <span className="ml-2">{title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
