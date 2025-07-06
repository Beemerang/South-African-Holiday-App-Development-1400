import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContent } from '../context/ContentContext';
import { useMeta } from '../context/MetaContext';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';
import { getAllCountries, getCountryByCode } from '../data/countries';
import { useUserLocation } from '../hooks/useUserLocation';
import { format, parseISO } from 'date-fns';
import MetaEditor from './MetaEditor';
import AdSenseAd from './AdSenseAd';

const { FiEdit3, FiSave, FiX, FiImage, FiGlobe, FiMapPin, FiCalendar, FiUsers, FiSearch, FiNavigation, FiArrowUp, FiExternalLink } = FiIcons;

const HomePage = ({ isAdmin }) => {
  const { homeContent, updateHomeContent } = useContent();
  const { getPageMeta } = useMeta();
  const { getHolidaysForCountry } = useGlobalHolidays();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(homeContent);
  const [featuredHoliday, setFeaturedHoliday] = useState(null);
  const { userLocation, loading: locationLoading } = useUserLocation();

  const pageMeta = getPageMeta('/');

  // Generate random featured holiday on page load
  useEffect(() => {
    const generateRandomHoliday = () => {
      const countries = getAllCountries();
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const currentYear = new Date().getFullYear();
      const holidays = getHolidaysForCountry(randomCountry.code, currentYear);
      
      if (holidays && holidays.length > 0) {
        const randomHoliday = holidays[Math.floor(Math.random() * holidays.length)];
        
        // Holiday descriptions and images
        const holidayContent = {
          "New Year's Day": {
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
            description: "New Year's Day marks fresh beginnings and hope worldwide. People celebrate with fireworks, resolutions, and gatherings as they welcome the promise of a new year filled with possibilities."
          },
          "Independence Day": {
            image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop",
            description: "Independence Day celebrates a nation's freedom and sovereignty. It's a time for patriotic displays, parades, and reflection on the struggles and triumphs that led to independence."
          },
          "Christmas Day": {
            image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop",
            description: "Christmas Day celebrates the birth of Jesus Christ and brings families together worldwide. The holiday combines religious observance with traditions of gift-giving, feasting, and spreading goodwill."
          },
          "Labour Day": {
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
            description: "Labour Day honors workers and their contributions to society. It commemorates the labor movement's fight for fair wages, reasonable hours, and safe working conditions."
          },
          "Heritage Day": {
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
            description: "Heritage Day celebrates cultural diversity and the rich tapestry of traditions that make each nation unique. It's a time to honor ancestry, customs, and shared heritage."
          }
        };

        const defaultContent = {
          image: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80`,
          description: `${randomHoliday.name} is an important celebration in ${randomCountry.name}. This special day brings communities together to honor traditions, share cultural experiences, and create lasting memories with family and friends.`
        };

        const content = holidayContent[randomHoliday.name] || defaultContent;

        setFeaturedHoliday({
          ...randomHoliday,
          country: randomCountry,
          image: content.image,
          content: content.description
        });
      }
    };

    generateRandomHoliday();
  }, []); // Run once on component mount

  useEffect(() => {
    // Update document meta tags
    document.title = pageMeta.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageMeta.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = pageMeta.description;
      document.head.appendChild(metaDescription);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', pageMeta.keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = pageMeta.keywords;
      document.head.appendChild(metaKeywords);
    }
  }, [pageMeta]);

  const handleSave = () => {
    updateHomeContent(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(homeContent);
    setIsEditing(false);
  };

  const handleImageEdit = (imageId, field, value) => {
    const updatedImages = editContent.images.map(img =>
      img.id === imageId ? { ...img, [field]: value } : img
    );
    setEditContent({ ...editContent, images: updatedImages });
  };

  const scrollToSearchBar = () => {
    const header = document.querySelector('header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const countries = getAllCountries();

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:image" content={homeContent.images[0]?.url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": homeContent.title,
            "description": pageMeta.description,
            "url": window.location.origin,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${window.location.origin}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <motion.div
        className="space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Meta Editor for Admin */}
        <MetaEditor path="/" isAdmin={isAdmin} />

        {/* Header AdSense */}
        <AdSenseAd slot="1234567890" position="header" isAdmin={isAdmin} />

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editContent.title}
                  onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                  className="w-full text-4xl font-bold text-center bg-transparent border-2 border-sa-green rounded-lg px-4 py-2"
                  placeholder="Main Title"
                />
                <input
                  type="text"
                  value={editContent.subtitle}
                  onChange={(e) => setEditContent({ ...editContent, subtitle: e.target.value })}
                  className="w-full text-xl text-center bg-transparent border-2 border-sa-blue rounded-lg px-4 py-2"
                  placeholder="Subtitle"
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                  {homeContent.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600">
                  {homeContent.subtitle}
                </p>
              </>
            )}
          </motion.div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex justify-center space-x-2">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiEdit3} />
                  <span>Edit Content</span>
                </motion.button>
              )}
            </div>
          )}
        </section>

        {/* Featured Holiday Section */}
        {featuredHoliday && (
          <section>
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Holiday</h2>
              <p className="text-xl text-gray-600">Discover holidays from around the world</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full">
                  <img
                    src={featuredHoliday.image}
                    alt={featuredHoliday.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <SafeIcon icon={FiMapPin} className="text-sa-green" />
                    <span className="text-sm font-medium text-gray-600">
                      {featuredHoliday.country.name}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {featuredHoliday.name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} />
                      <span>{format(parseISO(featuredHoliday.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      featuredHoliday.type === 'National' ? 'bg-sa-green/10 text-sa-green' : 
                      featuredHoliday.type === 'Religious' ? 'bg-sa-blue/10 text-sa-blue' : 
                      'bg-sa-yellow/10 text-sa-yellow'
                    }`}>
                      {featuredHoliday.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredHoliday.content}
                  </p>
                  
                  <div className="space-y-3">
                    <Link
                      to={`/holiday/${featuredHoliday.id}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors font-medium"
                    >
                      <span>Learn More</span>
                      <SafeIcon icon={FiExternalLink} />
                    </Link>
                    
                    <div className="pt-2">
                      <Link
                        to={`/country/${featuredHoliday.country.code}`}
                        className="text-sa-blue hover:text-sa-blue/80 transition-colors text-sm font-medium"
                      >
                        View all {featuredHoliday.country.name} holidays →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Sidebar AdSense */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Image Gallery */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeContent.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => handleImageEdit(image.id, 'url', e.target.value)}
                            className="w-full text-sm bg-white/20 border border-white/30 rounded px-2 py-1 text-black"
                            placeholder="Image URL"
                          />
                          <input
                            type="text"
                            value={image.caption}
                            onChange={(e) => handleImageEdit(image.id, 'caption', e.target.value)}
                            className="w-full text-sm bg-white/20 border border-white/30 rounded px-2 py-1 text-black"
                            placeholder="Caption"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-medium">{image.caption}</p>
                      )}
                    </div>
                    {isAdmin && !isEditing && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SafeIcon icon={FiImage} className="text-white bg-black/50 p-1 rounded" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </section>
          </div>

          {/* Sidebar with AdSense */}
          <div className="lg:col-span-1">
            <AdSenseAd slot="0987654321" position="sidebar" isAdmin={isAdmin} />
          </div>
        </div>

        {/* Description Section */}
        <section className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-lg shadow-md p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <SafeIcon icon={FiGlobe} className="text-sa-green text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">About Our Mission</h2>
            </div>
            {isEditing ? (
              <textarea
                value={editContent.description}
                onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent resize-vertical"
                placeholder="Description about the website..."
              />
            ) : (
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                {homeContent.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* Quick Access Section */}
        <section>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quick Access</h2>
            <p className="text-xl text-gray-600">Jump to popular destinations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Your Location Card */}
            {userLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link
                  to={`/country/${userLocation.code}`}
                  className="block bg-gradient-to-r from-sa-blue to-sa-green text-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <SafeIcon icon={FiNavigation} className="text-2xl" />
                    <div>
                      <h3 className="text-xl font-bold">Your Location</h3>
                      <p className="text-sm text-white/80">{userLocation.name}</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    {locationLoading ? 'Detecting your location...' : `Explore public holidays in ${userLocation.name}`}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <SafeIcon icon={FiMapPin} />
                    <span>{userLocation.continent}</span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* South Africa Special Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Link
                to="/south-africa"
                className="block bg-gradient-to-r from-sa-green to-sa-blue text-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <SafeIcon icon={FiMapPin} className="text-2xl" />
                  <h3 className="text-xl font-bold">South Africa</h3>
                </div>
                <p className="text-white/90 mb-4">
                  Explore South African public holidays with detailed information and PDF downloads.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <SafeIcon icon={FiCalendar} />
                  <span>12 Annual Holidays</span>
                </div>
              </Link>
            </motion.div>

            {/* Browse Countries Card - Fixed to link to /countries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Link
                to="/countries"
                className="block bg-gradient-to-r from-sa-yellow to-sa-red text-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <SafeIcon icon={FiGlobe} className="text-2xl" />
                  <h3 className="text-xl font-bold">Browse Countries</h3>
                </div>
                <p className="text-white/90 mb-4">
                  Explore holidays from all {countries.length} countries and territories worldwide.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <SafeIcon icon={FiSearch} />
                  <span>Search & Filter</span>
                </div>
              </Link>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <SafeIcon icon={FiUsers} className="text-3xl text-sa-blue mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">1000+</h3>
              <p className="text-gray-600">Holidays Documented</p>
            </motion.div>
          </div>
        </section>

        {/* Popular Countries Section */}
        <section id="countries-section">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Countries</h2>
            <p className="text-xl text-gray-600">Discover holidays from around the world</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 w-max">
                {countries.slice(0, 20).map((country, index) => (
                  <motion.div
                    key={country.code}
                    className="flex-shrink-0 w-48"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.4 + index * 0.02 }}
                  >
                    <Link
                      to={`/country/${country.code}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-center group h-full"
                    >
                      <SafeIcon icon={FiMapPin} className="text-2xl text-sa-green mx-auto mb-2 group-hover:text-sa-blue transition-colors" />
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{country.name}</h3>
                      <p className="text-xs text-gray-500">{country.continent}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Scroll indicator */}
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">← Scroll to explore countries →</p>
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            <button
              onClick={scrollToSearchBar}
              className="flex items-center justify-center space-x-2 text-sa-green hover:text-sa-green/80 transition-colors mx-auto group"
            >
              <SafeIcon icon={FiSearch} />
              <span className="text-lg">Use the search bar above to find any country</span>
              <SafeIcon icon={FiArrowUp} className="group-hover:animate-bounce" />
            </button>
            
            {/* Browse All Countries Button - Fixed to link to /countries */}
            <motion.div>
              <Link
                to="/countries"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors font-medium"
              >
                <SafeIcon icon={FiGlobe} />
                <span>Browse All Countries</span>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </motion.div>
    </>
  );
};

export default HomePage;