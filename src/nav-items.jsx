import { BookOpen, Flame, Heart, Clock, Users, User } from "lucide-react";
import Covers from "./pages/Covers.jsx";
import Match from "./pages/Match.jsx";
import Favorites from "./pages/Favorites.jsx";
import Recent from "./pages/Recent.jsx";
import Friends from "./pages/Friends.jsx";
import Profile from "./pages/Profile.jsx";

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
];
