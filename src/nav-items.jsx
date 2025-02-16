
import React from 'react';
import { 
  Gamepad2, 
  Book, 
  Compass,
  Users,
  User,
  Settings as SettingsIcon,
  Clock,
  LogIn,
  ShoppingCart
} from 'lucide-react';
import Match from './pages/Match';
import Covers from './pages/Covers';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Recent from './pages/Recent';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Discover from './pages/Discover';

export const navItems = [
  {
    name: 'Match',
    to: '/',
    page: <Match />,
    icon: <Gamepad2 className="h-4 w-4 mr-2" />
  },
  {
    name: 'Covers',
    to: '/covers',
    page: <Covers />,
    icon: <Book className="h-4 w-4 mr-2" />
  },
  {
    name: 'Discover',
    to: '/discover',
    page: <Discover />,
    icon: <Compass className="h-4 w-4 mr-2" />
  },
  {
    name: 'Friends',
    to: '/friends',
    page: <Friends />,
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    name: 'Profile',
    to: '/profile',
    page: <Profile />,
    icon: <User className="h-4 w-4 mr-2" />
  },
  {
    name: 'Settings',
    to: '/settings',
    page: <Settings />,
    icon: <SettingsIcon className="h-4 w-4 mr-2" />
  },
  {
    name: 'Recent',
    to: '/recent',
    page: <Recent />,
    icon: <Clock className="h-4 w-4 mr-2" />
  },
  {
    name: 'Login/Register',
    to: '/login',
    page: <Login />,
    icon: <LogIn className="h-4 w-4 mr-2" />
  },
  {
    name: 'Checkout',
    to: '/checkout',
    page: <Checkout />,
    icon: <ShoppingCart className="h-4 w-4 mr-2" />
  },
];
