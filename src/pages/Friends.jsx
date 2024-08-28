import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Friends = () => {
  // In a real app, you'd fetch this data from a backend
  const friends = [
    {name: "Alice Johnson", matchPercentage: 85, genres: ["Fantasy", "Sci-Fi"]},
    {name: "Bob Smith", matchPercentage: 72, genres: ["Mystery", "Thriller"]},
    {name: "Carol White", matchPercentage: 68, genres: ["Romance", "Historical Fiction"]},
    {name: "David Brown", matchPercentage: 91, genres: ["Non-Fiction", "Biography"]},
    {name: "Eve Green", matchPercentage: 79, genres: ["Classic Literature", "Poetry"]},
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Book Buddies</h2>
      <div className="space-y-4">
        {friends.map((friend, index) => (
          <Card key={index} className="bg-gray-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">{friend.name}</h3>
                <span className="text-green-500 font-bold">{friend.matchPercentage}% Match</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Favorite Genres: {friend.genres.join(", ")}</p>
              <Button variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Friends;