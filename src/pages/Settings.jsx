import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Bell, Eye, Book, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [matchingPreference, setMatchingPreference] = useState('balanced');
  const [contentFilter, setContentFilter] = useState('moderate');
  const [autoArchive, setAutoArchive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedEmailNotifications = localStorage.getItem('emailNotifications') !== 'false';
    const savedPrivateProfile = localStorage.getItem('privateProfile') === 'true';
    const savedMatchingPreference = localStorage.getItem('matchingPreference') || 'balanced';
    const savedContentFilter = localStorage.getItem('contentFilter') || 'moderate';
    const savedAutoArchive = localStorage.getItem('autoArchive') === 'true';

    setDarkMode(savedDarkMode);
    setEmailNotifications(savedEmailNotifications);
    setPrivateProfile(savedPrivateProfile);
    setMatchingPreference(savedMatchingPreference);
    setContentFilter(savedContentFilter);
    setAutoArchive(savedAutoArchive);

    // Apply dark mode if it was saved
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('emailNotifications', emailNotifications);
    localStorage.setItem('privateProfile', privateProfile);
    localStorage.setItem('matchingPreference', matchingPreference);
    localStorage.setItem('contentFilter', contentFilter);
    localStorage.setItem('autoArchive', autoArchive);

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card className="max-w-2xl mx-auto">
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
                Receive email updates about your account and new matches
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
          <div className="space-y-2">
            <Label htmlFor="matching-preference">Book Matching Preference</Label>
            <Select value={matchingPreference} onValueChange={setMatchingPreference}>
              <SelectTrigger id="matching-preference">
                <SelectValue placeholder="Select matching preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diverse">Diverse Recommendations</SelectItem>
                <SelectItem value="balanced">Balanced Mix</SelectItem>
                <SelectItem value="similar">Similar to Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-filter">Content Filter</Label>
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger id="content-filter">
                <SelectValue placeholder="Select content filter level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-archive">Auto-archive Burned Books</Label>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Automatically archive books you've "burned"
              </div>
            </div>
            <Switch
              id="auto-archive"
              checked={autoArchive}
              onCheckedChange={setAutoArchive}
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
