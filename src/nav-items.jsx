import { BookOpen, Flame, Heart, Clock, Users } from "lucide-react";
import Index from "./pages/Index.jsx";
import Favorites from "./pages/Favorites.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Covers",
    to: "/",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Match",
    to: "/match",
    icon: <Flame className="h-4 w-4" />,
    page: <Index />,
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
    page: <Index />, // Placeholder, create a new component for Recent if needed
  },
  {
    title: "Friends",
    to: "/friends",
    icon: <Users className="h-4 w-4" />,
    page: <Index />, // Placeholder, create a new component for Friends if needed
  },
];
