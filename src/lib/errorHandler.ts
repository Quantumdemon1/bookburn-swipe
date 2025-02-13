
import { toast } from "@/components/ui/use-toast";

export const handleError = (error: Error, context: string) => {
  console.error(`${context}:`, error);
  
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message || `${context}. Please try again.`,
  });
};
