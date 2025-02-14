
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const AchievementCard = ({ achievements }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;

