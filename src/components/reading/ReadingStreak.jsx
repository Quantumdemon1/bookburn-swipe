
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

const ReadingStreak = ({ streakDays, todayProgress, dailyReadingGoal }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Reading Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-orange-500">{streakDays} Days</div>
          <Progress value={(todayProgress / dailyReadingGoal) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {todayProgress} of {dailyReadingGoal} minutes read today
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingStreak;

