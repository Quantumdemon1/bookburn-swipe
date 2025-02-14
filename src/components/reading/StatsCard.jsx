
import React from 'react';
import { Card } from "@/components/ui/card";

const StatsCard = ({ booksCount, totalTime, averageTime }) => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">Books Viewed</h3>
          <p className="text-3xl font-bold">{booksCount}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">Total Time</h3>
          <p className="text-3xl font-bold">{totalTime}m</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">Avg. Time per Book</h3>
          <p className="text-3xl font-bold">{averageTime}m</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

