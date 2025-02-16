
import React, { useState, useEffect } from 'react';
import { Menu, BookOpen, ShoppingCart as CartIcon, Moon, Sun, LogOut, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from '../nav-items';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import ShoppingCart from './ShoppingCart';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Layout = () => {
  const { cart } = useCart();
  const { isAdmin, isAuthenticated, logout } = useUser();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'; // Changed default to 'dark'
    }
    return 'dark'; // Changed default to 'dark'
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

  // Filter navigation items based on admin status and authentication
  const filteredNavItems = navItems.filter(item => {
    if (item.hidden) return false;
    if (item.adminOnly && !isAdmin()) return false;
    // Hide Login/Register when authenticated
    if (item.name === 'Login/Register' && isAuthenticated()) return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-red-600 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 mr-2 text-white" />
          <h1 className="text-2xl font-bold text-white">Book Burn</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2 text-white">
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 relative text-white">
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
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover">
              {filteredNavItems.map(({ name, to, icon }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link to={to} className="flex items-center w-full px-2 py-2">
                    {icon}
                    <span>{name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              {isAuthenticated() && (
                <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full px-2 py-2 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
