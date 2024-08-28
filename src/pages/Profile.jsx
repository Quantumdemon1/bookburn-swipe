import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const Profile = () => {
  // In a real app, you'd fetch this data from a backend or local storage
  const user = {
    name: "John Doe",
    bio: "Avid reader and book enthusiast. Always on the lookout for my next great read!",
    favoriteGenres: ["Science Fiction", "Mystery", "Historical Fiction"],
    booksRead: 127,
    friendsCount: 45,
  };

  return (
    <div className="p-4">
      <Card className="bg-gray-800 mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.bio}</p>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteGenres.map((genre, index) => (
                <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-white">
            <div>
              <span className="text-2xl font-bold">{user.booksRead}</span>
              <p className="text-sm text-gray-400">Books Read</p>
            </div>
            <div>
              <span className="text-2xl font-bold">{user.friendsCount}</span>
              <p className="text-sm text-gray-400">Book Buddies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;