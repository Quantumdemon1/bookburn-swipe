import { BookOpen, Flame, Heart, Clock, Users, User, LogIn, UserPlus, ShoppingCart, Star, MessageSquare } from "lucide-react";
import Covers from "./pages/Covers.jsx";
import Match from "./pages/Match.jsx";
import Favorites from "./pages/Favorites.jsx";
import Recent from "./pages/Recent.jsx";
import Friends from "./pages/Friends.jsx";
import Profile from "./pages/Profile.jsx";
import Ratings from "./pages/Ratings.jsx";
import Reviews from "./pages/Reviews.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Covers",
    to: "/",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Covers />,
  },
  {
    title: "Match",
    to: "/match",
    icon: <Flame className="h-4 w-4" />,
    page: <Match />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Heart className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Recent",
    to: "/recent",
    icon: <Clock className="h-4 w-4" />,
    page: <Recent />,
  },
  {
    title: "Friends",
    to: "/friends",
    icon: <Users className="h-4 w-4" />,
    page: <Friends />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Ratings",
    to: "/ratings",
    icon: <Star className="h-4 w-4" />,
    page: <Ratings />,
  },
  {
    title: "Reviews",
    to: "/reviews",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <Reviews />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <LogIn className="h-4 w-4" />,
    page: <Login />,
  },
  {
    title: "Register",
    to: "/register",
    icon: <UserPlus className="h-4 w-4" />,
    page: <Register />,
  },
  {
    title: "Checkout",
    to: "/checkout",
    icon: <ShoppingCart className="h-4 w-4" />,
    page: <Checkout />,
  },
];
