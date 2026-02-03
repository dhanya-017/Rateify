import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTimes } from 'react-icons/fa';

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder,
  totalResults 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Store Name' },
    { value: 'address', label: 'Address' },
    { value: 'average_rating', label: 'Rating' },
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
        >
          <FaFilter className="w-4 h-4" />
          <FaSort className="w-4 h-4" />
          <span className="font-medium">Sort & Filter</span>
          <div className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.button>
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0, 
          opacity: showFilters ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Ascending (A-Z)</option>
                <option value="desc">Descending (Z-A)</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {totalResults > 0 ? (
            <span>
              Found <span className="font-semibold text-gray-900">{totalResults}</span> stores
            </span>
          ) : (
            <span className="text-gray-500">No stores found</span>
          )}
        </div>
        
        {(searchTerm || sortBy !== 'name' || sortOrder !== 'asc') && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Search: {searchTerm.substring(0, 10)}...
              </span>
            )}
            {sortBy !== 'name' && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Sort: {sortOptions.find(o => o.value === sortBy)?.label}
              </span>
            )}
            {sortOrder !== 'asc' && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Order: Descending
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
