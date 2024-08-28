import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Friends = () => {
  const friends = [
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg", matchPercentage: 85 },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg", matchPercentage: 72 },
    { id: 3, name: "Carol Williams", avatar: "/placeholder.svg", matchPercentage: 68 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Friends with Similar Tastes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <Card key={friend.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{friend.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{friend.matchPercentage}% Match</p>
              <Button className="w-full mt-4">View Profile</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Friends;