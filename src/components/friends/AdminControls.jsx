
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, UserX, Flag, Ban } from 'lucide-react';

const AdminControls = ({ onModerate }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Admin Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Reported Users</h3>
              <p className="text-sm text-muted-foreground">3 new reports</p>
            </div>
            <Badge variant="destructive">3</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Suspend User
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Review Reports
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Ban User
            </Button>
            <Button variant="outline" onClick={() => onModerate('verify')}>
              Verify Accounts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminControls;
