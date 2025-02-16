import React from 'react';
import Match from './pages/Match';
import Covers from './pages/Covers';
import Reviews from './pages/Reviews';
import Ratings from './pages/Ratings';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
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
    page: <Match />
  },
  {
    name: 'Covers',
    to: '/covers',
    page: <Covers />
  },
  {
    name: 'Discover',
    to: '/discover',
    page: <Discover />
  },
  {
    name: 'Reviews',
    to: '/reviews',
    page: <Reviews />
  },
  {
    name: 'Ratings',
    to: '/ratings',
    page: <Ratings />
  },
  {
    name: 'Favorites',
    to: '/favorites',
    page: <Favorites />
  },
  {
    name: 'Messages',
    to: '/messages',
    page: <Messages />
  },
  {
    name: 'Friends',
    to: '/friends',
    page: <Friends />
  },
  {
    name: 'Profile',
    to: '/profile',
    page: <Profile />
  },
  {
    name: 'Settings',
    to: '/settings',
    page: <Settings />
  },
  {
    name: 'Recent',
    to: '/recent',
    page: <Recent />
  },
  {
    name: 'Login',
    to: '/login',
    page: <Login />
  },
  {
    name: 'Register',
    to: '/register',
    page: <Register />
  },
  {
    name: 'Checkout',
    to: '/checkout',
    page: <Checkout />
  },
];
