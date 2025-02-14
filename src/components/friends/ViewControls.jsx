
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List } from 'lucide-react';

const ViewControls = ({ sortBy, setSortBy, viewMode, setViewMode }) => {
  return (
    <Card className="p-4 flex items-center gap-4">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="match">Match %</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2 border-l pl-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('grid')}
          className={`${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('list')}
          className={`${viewMode === 'list' ? 'bg-primary/10' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ViewControls;
