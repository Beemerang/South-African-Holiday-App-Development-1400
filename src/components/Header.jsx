import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToggle';
import PDFDownload from './PDFDownload';

const { FiCalendar, FiSettings, FiFlag } = FiIcons;

const Header = ({ viewMode, setViewMode, isAdmin, setIsAdmin }) => {
  const navigate = useNavigate();

  const handleAdminToggle = () => {
    if (!isAdmin) {
      const password = prompt('Enter admin password:');
      if (password === 'admin123') {
        setIsAdmin(true);
        navigate('/admin');
      } else {
        alert('Invalid password');
      }
    } else {
      setIsAdmin(false);
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <motion.header
      className="bg-white shadow-lg border-b-4 border-sa-green"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 text-left hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-sa-green p-2 rounded-lg">
              <SafeIcon icon={FiFlag} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sa-green">
                SA Public Holidays
              </h1>
              <p className="text-sm text-gray-600">
                Official South African Public Holidays
              </p>
            </div>
          </motion.button>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <SearchBar />
            <div className="flex items-center space-x-2">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              <PDFDownload />
              <motion.button
                onClick={handleAdminToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isAdmin
                    ? 'bg-sa-red text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isAdmin ? 'Exit Admin' : 'Admin Login'}
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;