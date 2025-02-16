
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AdminControls from '@/components/friends/AdminControls';
import UserManagement from '@/components/admin/UserManagement';
import SystemStats from '@/components/admin/SystemStats';
import ModQueue from '@/components/admin/ModQueue';

const Admin = () => {
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  if (!user || !isAdmin()) {
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <SystemStats />
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="controls">System Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="moderation">
          <ModQueue />
        </TabsContent>
        
        <TabsContent value="controls">
          <AdminControls onModerate={(action) => {
            toast({
              title: "Action Triggered",
              description: `${action} action was triggered`,
            });
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
