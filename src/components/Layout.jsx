import React from 'react';
import { Menu, User, Settings } from 'lucide-react';
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
    <div className="flex min-h-screen">
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;