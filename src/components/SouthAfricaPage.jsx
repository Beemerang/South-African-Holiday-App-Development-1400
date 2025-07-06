import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHolidays } from '../context/HolidayContext';
import { useAnalytics } from '../context/AnalyticsContext';
import HolidayList from './HolidayList';
import HolidayCalendar from './HolidayCalendar';
import ViewToggle from './ViewToggle';
import PDFDownload from './PDFDownload';
import SearchBar from './SearchBar';

const { FiFlag, FiCalendar, FiList } = FiIcons;

const SouthAfricaPage = ({ isAdmin }) => {
  const { filteredHolidays, selectedYear } = useHolidays();
  const { trackPageView } = useAnalytics();
  const [viewMode, setViewMode] = useState('list');

  React.useEffect(() => {
    trackPageView('/south-africa');
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>South African Public Holidays {selectedYear} - Official Calendar</title>
        <meta name="description" content={`Complete list of South African public holidays for ${selectedYear}. Download PDF calendar, view dates, and learn about each holiday's significance.`} />
        <meta name="keywords" content="South Africa public holidays, SA holidays, South African calendar, public holidays PDF, Freedom Day, Heritage Day" />
        <meta property="og:title" content={`South African Public Holidays ${selectedYear}`} />
        <meta property="og:description" content={`Official South African public holidays calendar for ${selectedYear}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `South African Public Holidays ${selectedYear}`,
            "description": `Complete list of South African public holidays for ${selectedYear}`,
            "url": window.location.href,
            "about": {
              "@type": "Country",
              "name": "South Africa"
            }
          })}
        </script>
      </Helmet>

      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-sa-green p-3 rounded-lg">
              <SafeIcon icon={FiFlag} className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
                South African Public Holidays
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-2">
                Official Public Holidays for {selectedYear}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-600 leading-relaxed">
              South Africa observes 12 public holidays annually, reflecting the country's diverse cultural heritage and historic journey to democracy. 
              These holidays commemorate important events in South African history, from the struggle against apartheid to the celebration of cultural diversity. 
              The holidays include significant days like Freedom Day (April 27), which marks the first democratic elections in 1994, and Heritage Day (September 24), 
              celebrating the nation's cultural diversity.
            </p>
          </motion.div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-2">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            <PDFDownload />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SafeIcon icon={FiCalendar} className="text-3xl text-sa-green mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{filteredHolidays.length}</h3>
            <p className="text-gray-600">Public Holidays</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SafeIcon icon={FiFlag} className="text-3xl text-sa-blue mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{selectedYear}</h3>
            <p className="text-gray-600">Current Year</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SafeIcon icon={FiList} className="text-3xl text-sa-yellow mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">Multiple</h3>
            <p className="text-gray-600">View Formats</p>
          </motion.div>
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {viewMode === 'list' ? <HolidayList /> : <HolidayCalendar />}
        </motion.div>
      </motion.div>
    </>
  );
};

export default SouthAfricaPage;