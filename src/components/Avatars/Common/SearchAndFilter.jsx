import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchAndFilter = ({ 
  searchValue, 
  onSearchChange, 
  placeholder = "Search...",
  sortField,
  sortOrder,
  onSortChange,
  sortOptions = []
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue || '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearch(searchValue || '');
  }, [searchValue]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const handleSortChange = (field, order) => {
    onSortChange(field, order);
    setShowFilters(false);
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {localSearch && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Sort Filter */}
      {sortOptions.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Sort
            {sortField && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {sortField}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-200">
                  Sort by
                </div>
                {sortOptions.map((option) => (
                  <div key={option.field} className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {option.label}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSortChange(option.field, 'ASC')}
                        className={`px-2 py-1 text-xs rounded ${
                          sortField === option.field && sortOrder === 'ASC'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Ascending
                      </button>
                      <button
                        onClick={() => handleSortChange(option.field, 'DESC')}
                        className={`px-2 py-1 text-xs rounded ${
                          sortField === option.field && sortOrder === 'DESC'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Descending
                      </button>
                    </div>
                  </div>
                ))}
                {sortField && (
                  <div className="border-t border-gray-200 px-4 py-2">
                    <button
                      onClick={() => handleSortChange('', '')}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear Sort
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default SearchAndFilter;