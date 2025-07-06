import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { useHolidays } from '../context/HolidayContext';
import { format, parseISO, isSameDay } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from './LoadingSpinner';
import 'react-calendar/dist/Calendar.css';

const { FiExternalLink } = FiIcons;

const HolidayCalendar = () => {
  const { filteredHolidays, loading, selectedYear } = useHolidays();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) {
    return <LoadingSpinner />;
  }

  const getHolidayForDate = (date) => {
    return filteredHolidays.find(holiday =>
      isSameDay(parseISO(holiday.date), date)
    );
  };

  const tileContent = ({ date }) => {
    const holiday = getHolidayForDate(date);
    if (holiday) {
      return (
        <div className="holiday-marker">
          <div className="w-2 h-2 bg-sa-red rounded-full mx-auto"></div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const holiday = getHolidayForDate(date);
    if (holiday) {
      return 'holiday-tile';
    }
    return '';
  };

  const selectedHoliday = getHolidayForDate(selectedDate);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Holiday Calendar {selectedYear}
        </h2>
        <div className="text-sm text-gray-600">
          {filteredHolidays.length} holiday{filteredHolidays.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="w-full custom-calendar"
              minDate={new Date(selectedYear, 0, 1)}
              maxDate={new Date(selectedYear, 11, 31)}
            />
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {selectedHoliday ? (
              <div className="space-y-4">
                <div className="p-4 bg-sa-green/10 rounded-lg border border-sa-green/20">
                  <h4 className="font-semibold text-sa-green mb-2">
                    {selectedHoliday.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedHoliday.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedHoliday.type === 'National' ? 'bg-sa-green text-white' : 'bg-sa-yellow text-black'
                    }`}>
                      {selectedHoliday.type}
                    </span>
                    {selectedHoliday.observed && (
                      <span className="text-xs text-gray-500">Observed</span>
                    )}
                  </div>
                  <Link
                    to={`/holiday/${selectedHoliday.id}`}
                    className="flex items-center gap-2 text-sa-green hover:text-sa-green/80 transition-colors text-sm font-medium"
                  >
                    <span>Learn More</span>
                    <SafeIcon icon={FiExternalLink} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No holiday on this date</p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 mt-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">All Holidays</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isSameDay(parseISO(holiday.date), selectedDate)
                      ? 'bg-sa-green text-white'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDate(parseISO(holiday.date))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{holiday.name}</div>
                      <div className="text-xs opacity-75">
                        {format(parseISO(holiday.date), 'MMM d')}
                      </div>
                    </div>
                    <Link
                      to={`/holiday/${holiday.id}`}
                      className="text-xs hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        .custom-calendar .react-calendar__tile {
          position: relative;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          font-size: 0.875rem;
        }
        .custom-calendar .react-calendar__tile:hover {
          background-color: #f3f4f6;
        }
        .custom-calendar .react-calendar__tile--active {
          background-color: #007A4D !important;
          color: white;
        }
        .custom-calendar .holiday-tile {
          background-color: #fef3f2;
          color: #dc2626;
          font-weight: 600;
        }
        .custom-calendar .holiday-tile:hover {
          background-color: #fecaca;
        }
        .holiday-marker {
          position: absolute;
          top: 4px;
          right: 4px;
        }
      `}</style>
    </motion.div>
  );
};

export default HolidayCalendar;