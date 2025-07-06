import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { continents } from '../data/countries';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';

const { FiMapPin, FiChevronDown, FiChevronRight } = FiIcons;

const LocationsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContinent, setActiveContinent] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedCountry } = useGlobalHolidays();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveContinent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
    setActiveContinent(null);
    navigate(`/country/${countryCode}`);
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiMapPin} />
        <span>Locations</span>
        <SafeIcon icon={FiChevronDown} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(continents).map(([continent, countries]) => (
              <div key={continent} className="border-b border-gray-100 last:border-b-0">
                <motion.button
                  onClick={() => setActiveContinent(activeContinent === continent ? null : continent)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between font-medium text-gray-800"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <span>{continent}</span>
                  <SafeIcon icon={FiChevronRight} className={`transform transition-transform ${activeContinent === continent ? 'rotate-90' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {activeContinent === continent && (
                    <motion.div
                      className="bg-gray-50"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {Object.entries(countries).map(([country, code]) => (
                        <motion.button
                          key={code}
                          onClick={() => handleCountrySelect(code)}
                          className="w-full px-6 py-2 text-left hover:bg-gray-100 text-sm text-gray-700 border-b border-gray-200 last:border-b-0"
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                        >
                          {country}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationsMenu;