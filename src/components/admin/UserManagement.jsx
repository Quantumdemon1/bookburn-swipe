import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserX, Shield, Ban, CheckCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase, safeOperation } from '@/lib/supabaseClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = {
  user: { label: "User", color: "secondary" },
  moderator: { label: "Moderator", color: "warning" },
  admin: { label: "Admin", color: "destructive" },
};

const STATUS = {
  active: { label: "Active", color: "success" },
  suspended: { label: "Suspended", color: "warning" },
  banned: { label: "Banned", color: "destructive" },
};

const UserManagement = () => {
  const { approveVerification } = useUser();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data: profiles, error } = await safeOperation(() =>
        supabase
          .from('profiles')
          .select('*, user:auth.users(email)')
      );

      if (error) throw error;

      setUsers(profiles.map(profile => ({
        ...profile,
        email: profile.user?.email,
        role: profile.role || 'user',
        status: profile.status || 'active'
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await safeOperation(() =>
        supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', userId)
      );

      if (error) throw error;

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${ROLES[newRole].label}`
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const { error } = await safeOperation(() =>
        supabase
          .from('profiles')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', userId)
      );

      if (error) throw error;

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast({
        title: "Status Updated",
        description: `User status has been updated to ${STATUS[newStatus].label}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (userId) => {
    try {
      const { memberNumber } = await approveVerification(userId);
      toast({
        title: "Verification Approved",
        description: `User has been verified with member number #${memberNumber}`
      });
      await fetchUsers();
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Search users..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
              <div className="col-span-2">User</div>
              <div>Role</div>
              <div>Status</div>
              <div className="col-span-2">Actions</div>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center">
                <div className="col-span-2">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div>
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                    disabled={user.email === 'kellis209@gmail.com'}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge variant={ROLES[user.role].color}>
                          {ROLES[user.role].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLES).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={user.status}
                    onValueChange={(newStatus) => handleStatusChange(user.id, newStatus)}
                    disabled={user.email === 'kellis209@gmail.com'}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge variant={STATUS[user.status].color}>
                          {STATUS[user.status].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex space-x-2">
                  {user.email !== 'kellis209@gmail.com' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'banned')}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'active')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      {!user.is_verified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;