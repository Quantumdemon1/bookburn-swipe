import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-900 text-white">
        <CardHeader className="bg-red-600 py-4">
          <CardTitle className="text-2xl font-bold text-center">Book Burn</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="bg-gray-800 text-white border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="bg-gray-800 text-white border-gray-700" />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">Log In</Button>
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