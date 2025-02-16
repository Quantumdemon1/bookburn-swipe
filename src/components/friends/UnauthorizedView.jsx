
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const UnauthorizedView = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Join the Community</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Log in or create an account to connect with friends, send messages, and share your favorite books!
        </p>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 hover:bg-red-500"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/register')}
            className="w-full"
          >
            Create Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnauthorizedView;
