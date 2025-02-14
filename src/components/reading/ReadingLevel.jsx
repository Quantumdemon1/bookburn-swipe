
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { calculateReadingLevel } from '@/utils/gamification';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ReadingLevel = ({ totalMinutes }) => {
  const level = calculateReadingLevel(totalMinutes);
  const nextLevel = calculateReadingLevel(totalMinutes + 1);
  const progress = ((totalMinutes - level.min) / (level.max - level.min)) * 100;

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Your reading level based on total reading time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          Reading Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-2xl font-bold text-blue-500">{level.name}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Read for {level.max} minutes to reach the next level!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {nextLevel.min - totalMinutes} minutes until {nextLevel.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingLevel;
