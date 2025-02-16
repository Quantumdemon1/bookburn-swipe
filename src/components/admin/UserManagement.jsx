import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, Shield, Ban } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/components/ui/use-toast";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", role: "user" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "suspended", role: "user" },
  { id: 3, name: "Admin User", email: "admin@example.com", status: "active", role: "admin" },
];

const UserManagement = () => {
  const { approveVerification } = useUser();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

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

        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {mockUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center">
              <div>{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div>
                <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div>
                <Badge variant={user.status === 'active' ? "success" : "warning"}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <UserX className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Ban className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
