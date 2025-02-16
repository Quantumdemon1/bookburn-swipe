
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Flag } from 'lucide-react';

const mockReports = [
  { 
    id: 1, 
    type: "review",
    content: "This review contains inappropriate language",
    reporter: "user123",
    reportedUser: "user456",
    status: "pending"
  },
  { 
    id: 2, 
    type: "user",
    content: "Spam account posting promotional content",
    reporter: "user789",
    reportedUser: "spammer123",
    status: "pending"
  },
];

const ModQueue = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-600" />
          Moderation Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">Report #{report.id}</h3>
                    <p className="text-sm text-muted-foreground">{report.content}</p>
                  </div>
                  <Badge>{report.type}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Reporter</p>
                    <p className="text-sm text-muted-foreground">{report.reporter}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reported User</p>
                    <p className="text-sm text-muted-foreground">{report.reportedUser}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Dismiss
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Check className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModQueue;
