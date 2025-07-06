import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiList, FiCalendar } = FiIcons;

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <motion.button
        onClick={() => setViewMode('list')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'list' 
            ? 'bg-sa-green text-white shadow-sm' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiList} />
        <span className="hidden sm:inline">List</span>
      </motion.button>
      
      <motion.button
        onClick={() => setViewMode('calendar')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'calendar' 
            ? 'bg-sa-green text-white shadow-sm' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiCalendar} />
        <span className="hidden sm:inline">Calendar</span>
      </motion.button>
    </div>
  );
};

export default ViewToggle;