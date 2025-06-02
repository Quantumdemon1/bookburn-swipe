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
import { supabase, safeOperation, profileFallback } from '@/lib/supabaseClient';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isVerified, getMemberNumber, requestVerification } = useUser();
  const [isRequestingVerification, setIsRequestingVerification] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First fetch the basic profile data
        const { data: profileData, error: profileError } = await safeOperation(
          () => supabase
            .from('profiles')
            .select('name, avatar_url, bio, is_verified, member_number')
            .eq('id', user.id)
            .single()
        );

        if (profileError) throw profileError;

        // Fetch review statistics
        const { data: reviewStats, error: reviewError } = await safeOperation(
          () => supabase
            .from('reviews')
            .select('rating')
            .eq('user_id', user.id)
        );

        if (reviewError) throw reviewError;

        // Fetch book interactions count
        const { count: booksRead, error: booksError } = await safeOperation(
          () => supabase
            .from('book_interactions')
            .select('book_id', { count: 'exact', head: true })
            .eq('user_id', user.id)
        );

        if (booksError) throw booksError;

        // Calculate review statistics
        const reviewsCount = reviewStats?.length || 0;
        const avgRating = reviewStats?.length 
          ? reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewStats.length 
          : 0;

        // Combine all data
        const combinedData = {
          ...profileData,
          reviews_count: reviewsCount,
          avg_rating: avgRating,
          books_read: booksRead || 0
        };

        setProfile(combinedData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Using offline data.",
          variant: "destructive"
        });
        setProfile(profileFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleVerificationRequest = async () => {
    try {
      setIsRequestingVerification(true);
      await requestVerification();
      toast({
        title: "Verification Requested",
        description: "Your verification request has been submitted successfully.",
      });
    } catch (error) {
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

  const handleSaveProfile = async (updatedProfile) => {
    try {
      const { error } = await safeOperation(
        () => supabase
          .from('profiles')
          .update({
            name: updatedProfile.name,
            bio: updatedProfile.bio,
            avatar_url: updatedProfile.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
      );

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));

      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again when you're back online.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile</p>
        <Button onClick={() => navigate('/login')} className="mt-4">
          Log In
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (isEditing) {
    return <EditProfile user={profile} onSave={handleSaveProfile} onCancel={handleCancelEdit} />;
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
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl mb-1">
              {profile?.name}
              {isVerified() && (
                <Badge className="ml-2 bg-blue-500\" variant=\"secondary">
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
          <p className="text-center text-gray-600 mb-6">{profile?.bio || 'No bio available'}</p>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="flex flex-col items-center">
              <Book className="w-8 h-8 mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{profile?.books_read || 0}</p>
              <p className="text-sm text-gray-600">Books Read</p>
            </div>
            <div className="flex flex-col items-center">
              <PenTool className="w-8 h-8 mb-2 text-green-500" />
              <p className="text-2xl font-bold">{profile?.reviews_count || 0}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{(profile?.avg_rating || 0).toFixed(1)}</p>
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