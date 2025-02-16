
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Volume2 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex items-center space-x-4 mb-6">
        <SettingsIcon className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifs" className="text-sm">Email Notifications</label>
              <Switch id="email-notifs" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="push-notifs" className="text-sm">Push Notifications</label>
              <Switch id="push-notifs" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="profile-visible" className="text-sm">Public Profile</label>
              <Switch id="profile-visible" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="reading-history" className="text-sm">Share Reading History</label>
              <Switch id="reading-history" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode" className="text-sm">Dark Mode</label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="reduce-motion" className="text-sm">Reduce Motion</label>
              <Switch id="reduce-motion" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Sound & Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="sound-effects" className="text-sm">Sound Effects</label>
              <Switch id="sound-effects" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="haptic" className="text-sm">Haptic Feedback</label>
              <Switch id="haptic" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
