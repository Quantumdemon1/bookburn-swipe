import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>
      <Card className="bg-gray-800 mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-matches" className="text-white">New Book Matches</Label>
              <Switch id="new-matches" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="friend-activity" className="text-white">Friend Activity</Label>
              <Switch id="friend-activity" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="book-recommendations" className="text-white">Book Recommendations</Label>
              <Switch id="book-recommendations" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile" className="text-white">Public Profile</Label>
              <Switch id="public-profile" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-reading-status" className="text-white">Show Reading Status</Label>
              <Switch id="show-reading-status" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">Change Password</Button>
            <Button variant="outline" className="w-full">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;