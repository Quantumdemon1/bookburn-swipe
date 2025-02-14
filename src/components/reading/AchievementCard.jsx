
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AchievementCard = ({ achievements }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Your reading achievements and badges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <TooltipProvider key={achievement.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`text-center p-3 rounded-lg transition-all duration-200 ${
                      achievement.earned
                        ? 'bg-primary/10 animate-scale-in'
                        : 'opacity-50'
                    }`}
                  >
                    {achievement.icon}
                    <div className="text-sm font-medium mt-2">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {achievement.earned
                      ? `Earned: ${achievement.description}`
                      : `Complete ${achievement.description} to earn this achievement`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
