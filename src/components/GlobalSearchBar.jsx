import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';
import { useAnalytics } from '../context/AnalyticsContext';

const { FiSearch, FiX, FiMapPin } = FiIcons;

const GlobalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedYear, 
    setSelectedYear, 
    setSelectedCountry, 
    searchCountries 
  } = useGlobalHolidays();
  
  const { trackSearch } = useAnalytics();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchCountries(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, searchCountries]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setSearchTerm(value);
    if (value) {
      trackSearch(value, searchResults);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.code);
    setSearchQuery('');
    setShowResults(false);
    navigate(`/country/${country.code}`);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 relative" ref={searchRef}>
      <motion.div
        className="relative flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search countries or holidays..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent w-full sm:w-80"
        />
        {searchQuery && (
          <motion.button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiX} />
          </motion.button>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchResults.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {searchResults.map((country) => (
                <motion.button
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <SafeIcon icon={FiMapPin} className="text-sa-green" />
                  <div>
                    <div className="font-medium text-gray-800">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.continent}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.select
        value={selectedYear}
        onChange={(e) => handleYearChange(parseInt(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent min-w-[100px]"
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

export default GlobalSearchBar;