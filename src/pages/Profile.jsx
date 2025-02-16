import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Star, PenTool, Heart, MessageSquare, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import EditProfile from '@/components/EditProfile';
import Ratings from './Ratings';
import Reviews from './Reviews';
import Favorites from './Favorites';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isVerified, getMemberNumber } = useUser();
  const [isRequestingVerification, setIsRequestingVerification] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Try to upsert the profile first
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
          favorite_genres: [],
          books_read: 0,
          reviews: 0,
          rating: 0
        }, {
          onConflict: 'id',
          ignoreDuplicates: true
        });

      if (upsertError) throw upsertError;

      // Then fetch the profile data
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      setProfileData({
        ...user,
        ...profile,
        favoriteGenres: profile.favorite_genres || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationRequest = async () => {
    try {
      setIsRequestingVerification(true);
      
      // Create verification request in Supabase
      const { error } = await supabase
        .from('verification_requests')
        .insert([
          {
            user_id: user.id,
            status: 'pending',
            requested_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Verification Requested",
        description: "Your verification request has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRequestingVerification(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedUser) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: updatedUser.name,
          age: updatedUser.age,
          bio: updatedUser.bio,
          favorite_genres: updatedUser.favoriteGenres,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfileData(updatedUser);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile changes"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (isEditing) {
    return <EditProfile user={profileData} onSave={handleSaveProfile} onCancel={handleCancelEdit} />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={profileData?.avatar} alt={profileData?.name} />
              <AvatarFallback>{profileData?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl mb-1">
              {profileData?.name}
              {isVerified() && (
                <Badge className="ml-2 bg-blue-500" variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Member #{getMemberNumber()}
                </Badge>
              )}
            </CardTitle>
            {!isVerified() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerificationRequest}
                disabled={isRequestingVerification}
                className="mt-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                Request Verification
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">{profileData?.bio || 'No bio available'}</p>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.favoriteGenres?.map((genre, index) => (
                <Badge key={index} variant="secondary">{genre}</Badge>
              )) || <p className="text-gray-500">No favorite genres added</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="flex flex-col items-center">
              <Book className="w-8 h-8 mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{profileData?.booksRead || 0}</p>
              <p className="text-sm text-gray-600">Books Read</p>
            </div>
            <div className="flex flex-col items-center">
              <PenTool className="w-8 h-8 mb-2 text-green-500" />
              <p className="text-2xl font-bold">{profileData?.reviews || 0}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{(profileData?.rating || 0).toFixed(1)}</p>
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </div>
          </div>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews" className="flex items-center gap-2">
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
            <TabsContent value="reviews">
              <Reviews />
            </TabsContent>
            <TabsContent value="ratings">
              <Ratings />
            </TabsContent>
            <TabsContent value="favorites">
              <Favorites />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
