
import React from 'react';
import SearchBar from '@/components/SearchBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterSection = ({ onSearch, onGenreChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="w-full md:w-auto">
        <SearchBar onSearch={onSearch} />
      </div>
      <Select onValueChange={onGenreChange} defaultValue="all">
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          <SelectItem value="adventure">Adventure</SelectItem>
          <SelectItem value="classic">Classic</SelectItem>
          <SelectItem value="horror">Horror</SelectItem>
          <SelectItem value="non-fiction">Non-Fiction</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSection;
