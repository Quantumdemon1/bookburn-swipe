
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from 'lucide-react';

const FilterBar = ({ matchFilter, setMatchFilter, selectedInterest, setSelectedInterest }) => {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Match %</span>
      </div>
      <Slider
        value={matchFilter}
        onValueChange={setMatchFilter}
        max={100}
        step={5}
        className="w-32"
      />
      <span className="text-sm font-medium min-w-[3rem]">{matchFilter}%+</span>
      <Select value={selectedInterest} onValueChange={setSelectedInterest}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Interests" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Interests</SelectItem>
          <SelectItem value="Books">Books</SelectItem>
          <SelectItem value="Music">Music</SelectItem>
          <SelectItem value="Films">Films</SelectItem>
          <SelectItem value="Games">Games</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  );
};

export default FilterBar;
