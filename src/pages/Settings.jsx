import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Here you would typically save these settings to a backend or local storage
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Here you would typically apply the theme change
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Theme</Label>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark mode
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              id="theme-toggle"
            >
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Receive email updates about your account
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="private-profile">Private Profile</Label>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Make your profile visible to friends only
              </div>
            </div>
            <Switch
              id="private-profile"
              checked={privateProfile}
              onCheckedChange={setPrivateProfile}
            />
          </div>
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;