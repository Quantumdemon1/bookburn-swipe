
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BookCardSkeleton = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-white animate-pulse">
      <CardContent className="p-6">
        <div className="rounded-3xl bg-white text-black p-6 mb-6">
          <Skeleton className="w-full h-64 rounded-lg mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex flex-wrap gap-2 mt-2">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-16 w-16 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-12 w-full mt-4 rounded-lg" />
      </CardContent>
    </Card>
  );
};

export default BookCardSkeleton;
