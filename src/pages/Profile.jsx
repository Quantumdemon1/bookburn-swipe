import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const user = {
    name: "John Doe",
    avatar: "/placeholder.svg",
    bio: "Book lover, coffee addict, and aspiring author.",
    favoriteGenres: ["Fiction", "Mystery", "Science Fiction"],
    booksRead: 127,
    reviews: 45,
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteGenres.map((genre, index) => (
                <Badge key={index} variant="secondary">{genre}</Badge>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.booksRead}</p>
              <p className="text-sm text-gray-600">Books Read</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.reviews}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;