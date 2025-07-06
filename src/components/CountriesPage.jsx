import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { getAllCountries, continents } from '../data/countries';
import { useMeta } from '../context/MetaContext';
import MetaEditor from './MetaEditor';
import AdSenseAd from './AdSenseAd';

const { FiSearch, FiX, FiFilter, FiMapPin, FiGlobe, FiUsers, FiCalendar } = FiIcons;

const CountriesPage = ({ isAdmin }) => {
  const { getPageMeta } = useMeta();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const allCountries = getAllCountries();
  const pageMeta = getPageMeta('/countries');

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    let filtered = allCountries;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.continent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by continent
    if (selectedContinent) {
      filtered = filtered.filter(country => country.continent === selectedContinent);
    }

    // Sort countries
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'continent':
          return a.continent.localeCompare(b.continent) || a.name.localeCompare(b.name);
        case 'code':
          return a.code.localeCompare(b.code);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [allCountries, searchTerm, selectedContinent, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedContinent('');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedContinent || sortBy !== 'name';

  // Get continent statistics
  const continentStats = useMemo(() => {
    const stats = {};
    Object.keys(continents).forEach(continent => {
      stats[continent] = Object.keys(continents[continent]).length;
    });
    return stats;
  }, []);

  return (
    <>
      <Helmet>
        <title>Countries - Global Public Holidays</title>
        <meta name="description" content="Browse public holidays from all countries around the world. Search and filter by continent to find holiday information for any nation." />
        <meta name="keywords" content="countries, public holidays, world holidays, international holidays, global calendar" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Countries - Global Public Holidays",
            "description": "Browse public holidays from all countries around the world",
            "url": `${window.location.origin}/countries`,
            "about": {
              "@type": "Thing",
              "name": "Global Public Holidays"
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
        {/* Meta Editor for Admin */}
        <MetaEditor path="/countries" isAdmin={isAdmin} />

        {/* Header AdSense */}
        <AdSenseAd slot="1234567890" position="header" isAdmin={isAdmin} />

        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Countries & Territories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore public holidays from {allCountries.length} countries and territories around the world. 
              Discover cultural celebrations, national days, and traditional observances from every continent.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white rounded-lg shadow-md p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SafeIcon icon={FiGlobe} className="text-2xl text-sa-green mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">{allCountries.length}</h3>
            <p className="text-sm text-gray-600">Countries</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SafeIcon icon={FiMapPin} className="text-2xl text-sa-blue mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">{Object.keys(continents).length}</h3>
            <p className="text-sm text-gray-600">Continents</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SafeIcon icon={FiCalendar} className="text-2xl text-sa-yellow mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">1000+</h3>
            <p className="text-sm text-gray-600">Holidays</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SafeIcon icon={FiUsers} className="text-2xl text-sa-red mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">7.8B+</h3>
            <p className="text-sm text-gray-600">People</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent w-full"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiX} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Continent Filter */}
                <div className="lg:w-48">
                  <select
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  >
                    <option value="">All Continents</option>
                    {Object.keys(continents).map(continent => (
                      <option key={continent} value={continent}>
                        {continent} ({continentStats[continent]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="lg:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="continent">Sort by Continent</option>
                    <option value="code">Sort by Code</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors text-sm ${
                      viewMode === 'grid' 
                        ? 'bg-sa-green text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <SafeIcon icon={FiGlobe} />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors text-sm ${
                      viewMode === 'list' 
                        ? 'bg-sa-green text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <SafeIcon icon={FiFilter} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="px-3 py-1 bg-sa-blue/10 text-sa-blue rounded-full text-sm flex items-center space-x-1">
                      <SafeIcon icon={FiSearch} />
                      <span>Search: "{searchTerm}"</span>
                    </span>
                  )}
                  {selectedContinent && (
                    <span className="px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-sm flex items-center space-x-1">
                      <SafeIcon icon={FiMapPin} />
                      <span>Continent: {selectedContinent}</span>
                    </span>
                  )}
                  {sortBy !== 'name' && (
                    <span className="px-3 py-1 bg-sa-yellow/10 text-sa-yellow rounded-full text-sm flex items-center space-x-1">
                      <SafeIcon icon={FiFilter} />
                      <span>Sort: {sortBy === 'continent' ? 'Continent' : 'Code'}</span>
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Results Summary */}
            <div className="text-gray-600 mb-6">
              Showing {filteredAndSortedCountries.length} of {allCountries.length} countries
              {hasActiveFilters && (
                <span className="ml-2 text-sa-blue">(filtered)</span>
              )}
            </div>

            {/* Countries Display */}
            {filteredAndSortedCountries.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiGlobe} className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No countries found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {filteredAndSortedCountries.map((country, index) => (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <Link
                        to={`/country/${country.code}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 text-center group h-full"
                      >
                        <SafeIcon 
                          icon={FiMapPin} 
                          className="text-3xl text-sa-green mx-auto mb-4 group-hover:text-sa-blue transition-colors" 
                        />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sa-green transition-colors">
                          {country.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{country.continent}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {country.code}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={`/country/${country.code}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 group"
                      >
                        <div className="flex items-center space-x-4">
                          <SafeIcon 
                            icon={FiMapPin} 
                            className="text-2xl text-sa-green group-hover:text-sa-blue transition-colors flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-sa-green transition-colors">
                              {country.name}
                            </h3>
                            <p className="text-sm text-gray-500">{country.continent}</p>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {country.code}
                          </span>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdSenseAd slot="0987654321" position="sidebar" isAdmin={isAdmin} />

            {/* Continent Quick Links */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 mt-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Filter by Continent</h3>
              <div className="space-y-2">
                {Object.entries(continentStats).map(([continent, count]) => (
                  <button
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedContinent === continent 
                        ? 'bg-sa-green text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{continent}</span>
                      <span className="text-sm opacity-75">{count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CountriesPage;