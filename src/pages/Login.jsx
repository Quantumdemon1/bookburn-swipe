import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { User, Users, UserCog } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    let user;
    switch (role) {
      case 'unregistered':
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        break;
      case 'user':
        user = {
          id: 'demo-user',
          email: 'user@demo.com',
          name: 'Demo User',
          role: 'user'
        };
        break;
      case 'admin':
        user = {
          id: 'demo-admin',
          email: 'admin@demo.com',
          name: 'Demo Admin',
          role: 'admin'
        };
        break;
    }

    if (user) {
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: "Demo Login",
        description: `Logged in as ${role}`,
      });
    } else {
      toast({
        title: "Demo Mode",
        description: "Browsing as unregistered user",
      });
    }
    
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-900 text-white">
        <CardHeader className="bg-red-600 py-4">
          <CardTitle className="text-2xl font-bold text-center">Book Burn</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                className="bg-gray-800 text-white border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-gray-800 text-white border-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Demo Accounts</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('unregistered')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Unregistered
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('user')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <User className="mr-2 h-4 w-4" />
                User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('admin')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <UserCog className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/register" className="text-red-400 hover:text-red-300">Don't have an account? Register</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
