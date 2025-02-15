
import React from 'react';
import SearchBar from '@/components/SearchBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookControls = ({ onSearch, selectedGenre, onGenreChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <SearchBar onSearch={onSearch} />
      <Select onValueChange={onGenreChange} defaultValue={selectedGenre}>
        <SelectTrigger className="w-[180px] mt-4 md:mt-0">
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

export default BookControls;
