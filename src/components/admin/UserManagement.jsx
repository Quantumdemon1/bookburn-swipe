
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, Shield, Ban, CheckCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", role: "user" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "suspended", role: "moderator" },
  { id: 3, name: "Admin User", email: "admin@example.com", status: "active", role: "admin" },
  { id: 4, name: "Kevin Ellis", email: "kellis209@gmail.com", status: "active", role: "admin" },
];

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
  const [users, setUsers] = useState(mockUsers);

  const verificationRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]')
    .filter(request => 
      request.status === 'pending' &&
      (request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       request.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleApprove = async (requestId) => {
    try {
      const { memberNumber } = await approveVerification(requestId);
      toast({
        title: "Verification Approved",
        description: `User has been verified with member number #${memberNumber}`,
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${ROLES[newRole].label}`,
    });
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast({
      title: "Status Updated",
      description: `User status has been updated to ${STATUS[newStatus].label}`,
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="bg-muted px-4 py-2 font-medium">
              Pending Verification Requests
            </div>
            {verificationRequests.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No pending verification requests
              </div>
            ) : (
              verificationRequests.map((request) => (
                <div key={request.id} className="p-4 border-t flex items-center justify-between">
                  <div>
                    <div className="font-medium">{request.userName}</div>
                    <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                    <div className="text-sm text-muted-foreground">
                      Requested: {new Date(request.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(request.id)}
                    className="ml-4"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-md border mt-4">
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
