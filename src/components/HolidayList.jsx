import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHolidays } from '../context/HolidayContext';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

const { FiCalendar, FiInfo, FiClock, FiExternalLink } = FiIcons;

const HolidayList = () => {
  const { filteredHolidays, loading, searchTerm, selectedYear } = useHolidays();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (filteredHolidays.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SafeIcon icon={FiCalendar} className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No holidays found
        </h3>
        <p className="text-gray-500">
          {searchTerm
            ? `No holidays match "${searchTerm}" in ${selectedYear}`
            : `No holidays found for ${selectedYear}`}
        </p>
      </motion.div>
    );
  }

  const getHolidayStatus = (date) => {
    const holidayDate = parseISO(date);
    if (isToday(holidayDate)) return 'today';
    if (isFuture(holidayDate)) return 'upcoming';
    return 'past';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'today': return 'bg-sa-red text-white';
      case 'upcoming': return 'bg-sa-green text-white';
      case 'past': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'past': return 'Past';
      default: return '';
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Public Holidays {selectedYear}
        </h2>
        <div className="text-sm text-gray-600">
          {filteredHolidays.length} holiday{filteredHolidays.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredHolidays.map((holiday, index) => {
          const status = getHolidayStatus(holiday.date);
          return (
            <motion.div
              key={holiday.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {holiday.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <SafeIcon icon={FiCalendar} className="text-sa-green" />
                      <span className="font-medium">
                        {format(parseISO(holiday.date), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <SafeIcon icon={FiInfo} className="text-sa-blue mt-0.5" />
                      <p className="text-sm">{holiday.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      holiday.type === 'National' ? 'bg-sa-green text-white' : 'bg-sa-yellow text-black'
                    }`}>
                      {holiday.type}
                    </span>
                    {holiday.observed && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <SafeIcon icon={FiClock} />
                        <span>Observed</span>
                      </div>
                    )}
                    <Link
                      to={`/holiday/${holiday.id}`}
                      className="flex items-center gap-1 text-sa-green hover:text-sa-green/80 transition-colors text-sm font-medium"
                    >
                      <span>Learn More</span>
                      <SafeIcon icon={FiExternalLink} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HolidayList;