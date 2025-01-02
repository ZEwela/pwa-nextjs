import React from "react";
import { Search } from "lucide-react";

interface EventFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
}

export function EventFilters({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedArea,
  setSelectedArea,
}: EventFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="exhibition">Exhibition</option>
          <option value="performance">Performance</option>
          <option value="opening">Opening</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Area
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Areas</option>
          <option value="Downtown">Downtown</option>
          <option value="Westside">Westside</option>
          <option value="Eastside">Eastside</option>
        </select>
      </div>
    </div>
  );
}
