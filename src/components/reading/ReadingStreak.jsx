
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ReadingStreak = ({ streakDays, todayProgress, dailyReadingGoal }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Flame className="h-5 w-5 text-orange-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Your daily reading streak. Keep it going!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          Reading Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-4xl font-bold text-orange-500">{streakDays} Days</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You've read books for {streakDays} consecutive days!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
