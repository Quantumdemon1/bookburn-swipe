import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Flag, Activity } from 'lucide-react';
import { supabase, safeOperation } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const SystemStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBooks: 0,
    pendingReports: 0,
    uptime: 98.9
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      const [
        { count: usersCount },
        { count: booksCount },
        { count: reportsCount }
      ] = await Promise.all([
        safeOperation(() => 
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
        ),
        safeOperation(() => 
          supabase
            .from('books')
            .select('id', { count: 'exact', head: true })
        ),
        safeOperation(() => 
          supabase
            .from('reactions')
            .select('id', { count: 'exact', head: true })
            .eq('type', 'report')
            .is('resolved', false)
        )
      ]);

      setStats({
        totalUsers: usersCount || 0,
        activeBooks: booksCount || 0,
        pendingReports: reportsCount || 0,
        uptime: 98.9 // This would come from a monitoring service in production
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Error",
        description: "Failed to load system statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading system statistics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Active accounts in the system</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Books</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeBooks}</div>
          <p className="text-xs text-muted-foreground">Books in the database</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReports}</div>
          <p className="text-xs text-muted-foreground">Reports awaiting review</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uptime}%</div>
          <p className="text-xs text-muted-foreground">System uptime this month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStats;