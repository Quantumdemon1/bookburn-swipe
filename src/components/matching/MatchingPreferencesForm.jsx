import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase, safeOperation } from '@/lib/supabaseClient';
import { useUser } from '@/contexts/UserContext';

const DEFAULT_PREFERENCES = {
  genre_weights: {
    fiction: 0.5,
    'non-fiction': 0.5,
    mystery: 0.5,
    romance: 0.5,
    'sci-fi': 0.5
  },
  author_weights: {},
  min_rating: 3,
  max_price: 50
};

const MatchingPreferencesForm = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    loadPreferences();
  }, [user?.id]);

  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      
      if (!isValidUUID(user.id)) {
        setPreferences(DEFAULT_PREFERENCES);
        toast({
          title: "Demo Account",
          description: "Preferences are not saved for demo accounts",
          variant: "default"
        });
        return;
      }

      const { data, error } = await safeOperation(() =>
        supabase
          .from('matching_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()
      );

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load matching preferences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreWeightChange = (genre, value) => {
    setPreferences(prev => ({
      ...prev,
      genre_weights: {
        ...prev.genre_weights,
        [genre]: value[0]
      }
    }));
  };

  const handleAuthorWeightChange = (author, value) => {
    setPreferences(prev => ({
      ...prev,
      author_weights: {
        ...prev.author_weights,
        [author]: value[0]
      }
    }));
  };

  const handleSave = async () => {
    try {
      if (!isValidUUID(user.id)) {
        toast({
          title: "Demo Account",
          description: "Preferences cannot be saved in demo mode",
          variant: "default"
        });
        return;
      }

      const { error } = await safeOperation(() =>
        supabase
          .from('matching_preferences')
          .upsert({
            user_id: user.id,
            ...preferences,
            updated_at: new Date().toISOString()
          })
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Matching preferences updated successfully"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save matching preferences",
        variant: "destructive"
      });
    }
  };

  if (!user?.id) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Please log in to manage your matching preferences
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matching Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Minimum Rating</Label>
            <Slider
              value={[preferences.min_rating]}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, min_rating: value[0] }))}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Only show books with at least {preferences.min_rating} stars
            </p>
          </div>

          <div>
            <Label>Maximum Price</Label>
            <Input
              type="number"
              value={preferences.max_price}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                max_price: parseFloat(e.target.value) || 0 
              }))}
              min={0}
              step={0.01}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum price for recommended books
            </p>
          </div>

          <div>
            <Label>Genre Preferences</Label>
            <div className="space-y-4 mt-2">
              {['fiction', 'non-fiction', 'mystery', 'romance', 'sci-fi'].map(genre => (
                <div key={genre}>
                  <Label className="capitalize">{genre}</Label>
                  <Slider
                    value={[preferences.genre_weights[genre] || 0.5]}
                    onValueChange={(value) => handleGenreWeightChange(genre, value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchingPreferencesForm;