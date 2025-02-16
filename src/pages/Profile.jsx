import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Star, PenTool, Heart, MessageSquare } from 'lucide-react';
import EditProfile from '@/components/EditProfile';
import Ratings from './Ratings';
import Reviews from './Reviews';
import Favorites from './Favorites';
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    age: 28,
    avatar: "/placeholder.svg",
    bio: "Book lover, coffee addict, and aspiring author. Always on the lookout for the next great read!",
    favoriteGenres: ["Fiction", "Mystery", "Science Fiction", "Fantasy", "Thriller"],
    booksRead: 127,
    reviews: 45,
    rating: 4.7
  });
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const handleSaveProfile = updatedUser => {
    setUser(updatedUser);
    setIsEditing(false);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  if (isEditing) {
    return <EditProfile user={user} onSave={handleSaveProfile} onCancel={handleCancelEdit} />;
  }
  return <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
          </div>
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl mb-1">{user.name}, {user.age}</CardTitle>
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-semibold">{user.rating.toFixed(1)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">{user.bio}</p>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteGenres.map((genre, index) => <Badge key={index} variant="secondary">{genre}</Badge>)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="flex flex-col items-center">
              <Book className="w-8 h-8 mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{user.booksRead}</p>
              <p className="text-sm text-gray-600">Books Read</p>
            </div>
            <div className="flex flex-col items-center">
              <PenTool className="w-8 h-8 mb-2 text-green-500" />
              <p className="text-2xl font-bold">{user.reviews}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{user.rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </div>
          </div>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews" className="flex items-center gap-2 bg-red-600 hover:bg-red-500">
                <MessageSquare className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="ratings" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Ratings
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-4">
              <Reviews />
            </TabsContent>
            <TabsContent value="ratings" className="mt-4">
              <Ratings />
            </TabsContent>
            <TabsContent value="favorites" className="mt-4">
              <Favorites />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default Profile;