
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TimelineCard = ({ readingHours }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Reading Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {readingHours.map((timeSlot, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{timeSlot.hour}</span>
                <span className="font-medium">{timeSlot.percentage}%</span>
              </div>
              <Progress value={timeSlot.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineCard;

