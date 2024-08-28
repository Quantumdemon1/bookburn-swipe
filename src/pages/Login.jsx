import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
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
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Log In</Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-red-400 hover:text-red-300">Don't have an account? Register</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
