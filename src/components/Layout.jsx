import React from 'react';
import { Menu, Settings, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from '../nav-items';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="bg-red-600 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">Book Burn</h1>
        </div>
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
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
