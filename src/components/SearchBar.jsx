import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHolidays } from '../context/HolidayContext';
import { useAnalytics } from '../context/AnalyticsContext';

const { FiSearch, FiX } = FiIcons;

const SearchBar = () => {
  const { searchTerm, setSearchTerm, selectedYear, setSelectedYear, filteredHolidays } = useHolidays();
  const { trackSearch, trackYearSelection } = useAnalytics();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      trackSearch(value, filteredHolidays);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    trackYearSelection(year);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search holidays..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent w-full sm:w-64"
        />
        {searchTerm && (
          <motion.button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiX} />
          </motion.button>
        )}
      </motion.div>

      <motion.select
        value={selectedYear}
        onChange={(e) => handleYearChange(parseInt(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </motion.select>
    </div>
  );
};

export default SearchBar;