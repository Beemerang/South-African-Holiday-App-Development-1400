import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useMeta } from '../context/MetaContext';
import { format, parseISO } from 'date-fns';
import { getCountryByCode } from '../data/countries';
import LoadingSpinner from './LoadingSpinner';
import MetaEditor from './MetaEditor';
import SocialShare from './SocialShare';
import AdSenseAd from './AdSenseAd';

const { FiArrowLeft, FiCalendar, FiMapPin, FiHeart, FiCamera, FiExternalLink, FiEdit3, FiSave, FiX, FiTag } = FiIcons;

const HolidayBlogPage = ({ isAdmin }) => {
  const { holidayId } = useParams();
  const navigate = useNavigate();
  const { getHolidayById } = useGlobalHolidays();
  const { trackHolidayView } = useAnalytics();
  const { generateHolidayMeta, getPageMeta } = useMeta();
  
  const [holiday, setHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHistory, setEditedHistory] = useState('');
  
  const currentPath = `/holiday/${holidayId}`;

  useEffect(() => {
    console.log('HolidayBlogPage - holidayId:', holidayId);
    setLoading(true);
    
    // Get holiday by ID using the new function
    const foundHoliday = getHolidayById(holidayId);
    console.log('Found holiday:', foundHoliday);
    
    if (foundHoliday) {
      setHoliday(foundHoliday);
      trackHolidayView(foundHoliday);
      
      // Generate meta data for this holiday
      const country = getCountryByCode(foundHoliday.countryCode);
      generateHolidayMeta(holidayId, foundHoliday.name, country ? country.name : 'Global');
      
      // Load custom history if available
      const customHistory = localStorage.getItem(`holiday-history-${holidayId}`);
      if (customHistory) {
        setEditedHistory(customHistory);
      }
    }
    
    setLoading(false);
  }, [holidayId, getHolidayById, trackHolidayView, generateHolidayMeta]);

  // Update document meta tags
  useEffect(() => {
    if (holiday) {
      const meta = getPageMeta(currentPath);
      document.title = meta.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = meta.description;
        document.head.appendChild(metaDescription);
      }
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Global Public Holidays';
    };
  }, [holiday, currentPath, getPageMeta]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!holiday) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Holiday Not Found</h2>
        <p className="text-gray-600 mb-4">
          The holiday you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Holiday ID: {holidayId}
        </p>
        <motion.button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Holiday Calendar
        </motion.button>
      </div>
    );
  }

  const country = getCountryByCode(holiday.countryCode);
  const pageMeta = getPageMeta(currentPath);

  const getHolidayDetails = (holidayName) => {
    // Enhanced holiday details with more comprehensive information
    const details = {
      "New Year's Day": {
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
        history: "New Year's Day marks the beginning of the Gregorian calendar year and is celebrated worldwide. The tradition of marking January 1st as the new year began with the Roman calendar reforms and has become a universal celebration of new beginnings, resolutions, and hope for the year ahead.",
        traditions: [
          "Fireworks displays at midnight",
          "Making New Year's resolutions",
          "Family gatherings and special meals",
          "Watching the sunrise on the first day of the year",
          "Attending religious services"
        ],
        celebrations: [
          "Join public celebrations and fireworks displays",
          "Attend New Year's concerts and events",
          "Participate in traditional customs",
          "Share meals with family and friends",
          "Reflect on the past year and set goals"
        ],
        outings: {
          "Default": [
            "Local community centers and festivals",
            "Public squares and celebration venues",
            "Religious centers and services", 
            "Cultural centers and events",
            "Family-friendly venues and activities"
          ]
        }
      },
      "Independence Day": {
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop",
        history: `${country ? country.name : 'This country'}'s Independence Day commemorates the nation's freedom and sovereignty. Independence days mark pivotal moments in a nation's history when it gained freedom from colonial rule or foreign domination, representing the birth of national identity and self-determination.`,
        traditions: [
          "Flag-raising ceremonies",
          "National parades and processions",
          "Cultural performances and displays",
          "Patriotic speeches and presentations",
          "Community celebrations across the nation"
        ],
        celebrations: [
          "Attend national ceremonies and parades",
          "Participate in cultural festivals",
          "Visit historical sites and monuments",
          "Engage in community service projects",
          "Celebrate with traditional foods and music"
        ],
        outings: {
          "Default": [
            "National monuments and memorials",
            "Government buildings and ceremonies",
            "Cultural centers and museums",
            "Public parks and celebration venues",
            "Historical sites and landmarks"
          ]
        }
      },
      "Labour Day": {
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
        history: "Labour Day, also known as International Workers' Day, commemorates the historic struggles of workers for better working conditions, fair wages, and workers' rights. It originated from the eight-hour workday movement and has become a global day of solidarity among workers.",
        traditions: [
          "Labour union marches and rallies",
          "Speeches by labour leaders",
          "Worker appreciation events",
          "Community festivals",
          "Educational seminars on workers' rights"
        ],
        celebrations: [
          "Participate in or support labour marches",
          "Attend worker appreciation events",
          "Visit museums showcasing industrial heritage",
          "Engage in community service projects",
          "Support local businesses and workers"
        ],
        outings: {
          "Default": [
            "Local labour union events",
            "Community centers",
            "Industrial heritage sites",
            "Craft markets and local businesses",
            "Educational institutions"
          ]
        }
      },
      "Christmas Day": {
        image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
        history: "Christmas Day celebrates the birth of Jesus Christ and is one of the most important Christian holidays worldwide. The celebration combines religious observance with cultural traditions, bringing families together and spreading messages of peace, love, and goodwill.",
        traditions: [
          "Christmas church services",
          "Family gatherings and feasts",
          "Gift exchanges and Christmas trees",
          "Carol singing and nativity plays",
          "Charitable activities and giving"
        ],
        celebrations: [
          "Attend Christmas church services",
          "Enjoy family gatherings and meals",
          "Participate in carol singing",
          "Visit Christmas markets and festivals",
          "Engage in charitable activities"
        ],
        outings: {
          "Default": [
            "Local church Christmas services",
            "Community Christmas events",
            "Christmas markets and festivals",
            "Family entertainment venues",
            "Charitable organizations"
          ]
        }
      }
    };

    return details[holidayName] || {
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
      history: `${holiday.name} is an important ${country ? country.name : ''} holiday with deep cultural and historical significance. This celebration reflects the values, traditions, and heritage of the nation, providing an opportunity for people to come together and honor their shared history and culture.`,
      traditions: [
        "Community celebrations and gatherings",
        "Cultural events and performances",
        "Traditional ceremonies and customs",
        "Family reunions and social activities",
        "Educational programs and presentations"
      ],
      celebrations: [
        "Attend local community events",
        "Participate in cultural activities",
        "Visit historical and cultural sites",
        "Engage with local traditions",
        "Spend time with family and friends"
      ],
      outings: {
        "Default": [
          "Local community centers",
          "Cultural institutions and museums",
          "Historical sites and monuments",
          "Public parks and venues",
          "Traditional markets and festivals"
        ]
      }
    };
  };

  const details = getHolidayDetails(holiday.name);

  // Get country-based outings instead of user location
  const getCountryBasedOutings = () => {
    const countrySpecificOutings = {
      'ZA': [ // South Africa
        "Cultural villages and heritage sites in South Africa",
        "Local community centers in South African cities",
        "South African museums and cultural institutions",
        "Traditional markets in South African towns",
        "South African national parks and monuments"
      ],
      'US': [ // United States
        "Community centers and civic buildings in the US",
        "American museums and cultural sites",
        "Local festivals and community events in America",
        "US national parks and monuments",
        "American cultural centers and libraries"
      ],
      'GB': [ // United Kingdom
        "British cultural centers and heritage sites",
        "Local community halls in the UK",
        "British museums and historical sites",
        "Traditional pubs and community venues",
        "UK national trust properties and gardens"
      ],
      'CN': [ // China
        "Chinese cultural centers and temples",
        "Local community centers in Chinese cities",
        "Chinese museums and heritage sites",
        "Traditional markets and cultural districts",
        "Chinese parks and public spaces"
      ],
      'IN': [ // India
        "Indian cultural centers and temples",
        "Local community halls in Indian cities",
        "Indian museums and heritage sites",
        "Traditional markets and cultural districts",
        "Indian parks and public venues"
      ]
    };

    return countrySpecificOutings[holiday.countryCode] || details.outings.Default || [];
  };

  const handleBack = () => {
    // Fixed: Navigate to the correct country page or home
    if (country) {
      navigate(`/country/${country.code}`);
    } else {
      navigate('/');
    }
  };

  const handleEditHistory = () => {
    if (!editedHistory) {
      setEditedHistory(details.history);
    }
    setIsEditing(true);
  };

  const handleSaveHistory = () => {
    localStorage.setItem(`holiday-history-${holidayId}`, editedHistory);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    const customHistory = localStorage.getItem(`holiday-history-${holidayId}`);
    setEditedHistory(customHistory || details.history);
    setIsEditing(false);
  };

  const getDisplayHistory = () => {
    const customHistory = localStorage.getItem(`holiday-history-${holidayId}`);
    return customHistory || details.history;
  };

  const handleOutingClick = (outing) => {
    const searchQuery = `${outing} ${country ? country.name : ''}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta property="og:title" content={holiday.name} />
        <meta property="og:description" content={holiday.description} />
        <meta property="og:image" content={details.image} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": holiday.name,
            "description": holiday.description,
            "startDate": holiday.date,
            "location": {
              "@type": "Country",
              "name": country ? country.name : 'Global'
            },
            "organizer": {
              "@type": "Organization",
              "name": "Global Public Holidays"
            }
          })}
        </script>
      </Helmet>

      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Meta Editor for Admin */}
        <MetaEditor path={currentPath} isAdmin={isAdmin} />

        {/* Header AdSense */}
        <AdSenseAd slot="1234567890" position="header" isAdmin={isAdmin} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleBack}
            className="flex items-center space-x-2 text-sa-green hover:text-sa-green/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to {country ? `${country.name} Calendar` : 'Calendar'}</span>
          </motion.button>
          
          <div className="flex items-center space-x-2">
            <SocialShare 
              url={window.location.href} 
              title={holiday.name} 
              description={holiday.description} 
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <img 
            src={details.image} 
            alt={holiday.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{holiday.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} />
                <span>{format(parseISO(holiday.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} />
                <span>{country ? country.name : 'Global'}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                holiday.type === 'National' ? 'bg-sa-green' : 
                holiday.type === 'Religious' ? 'bg-sa-blue' : 'bg-sa-yellow text-black'
              }`}>
                {holiday.type}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* History & Significance */}
            <motion.section
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">History & Significance</h2>
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <motion.button
                          onClick={handleSaveHistory}
                          className="flex items-center space-x-1 px-3 py-1 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SafeIcon icon={FiSave} />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SafeIcon icon={FiX} />
                          <span>Cancel</span>
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={handleEditHistory}
                        className="flex items-center space-x-1 px-3 py-1 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon icon={FiEdit3} />
                        <span>Edit</span>
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={editedHistory}
                  onChange={(e) => setEditedHistory(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent resize-vertical"
                  placeholder="Enter the history and significance of this holiday..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{getDisplayHistory()}</p>
              )}
            </motion.section>

            {/* Traditions */}
            <motion.section
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Traditions & Customs</h2>
              <ul className="space-y-2">
                {details.traditions.map((tradition, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiHeart} className="text-sa-red mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{tradition}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* How to Celebrate */}
            <motion.section
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Celebrate</h2>
              <ul className="space-y-2">
                {details.celebrations.map((celebration, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiCamera} className="text-sa-blue mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{celebration}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar AdSense */}
            <AdSenseAd slot="0987654321" position="sidebar" isAdmin={isAdmin} />

            {/* Holiday Details */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Holiday Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <p className="text-gray-800">{format(parseISO(holiday.date), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Country:</span>
                  <p className="text-gray-800">{country ? country.name : 'Global'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <p className="text-gray-800">{holiday.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-gray-800">{holiday.observed ? 'Observed' : 'Not Observed'}</p>
                </div>
              </div>
            </motion.div>

            {/* Country-Based Suggested Outings */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Suggested Activities
                {country && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (in {country.name})
                  </span>
                )}
              </h3>
              <ul className="space-y-2">
                {getCountryBasedOutings().map((outing, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiMapPin} className="text-sa-green mt-1 flex-shrink-0" />
                    <button
                      onClick={() => handleOutingClick(outing)}
                      className="text-gray-600 text-sm hover:text-sa-green hover:underline text-left transition-colors"
                    >
                      {outing}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <motion.button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(holiday.name + ' ' + (country ? country.name : '') + ' events')}`)}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiExternalLink} />
                  <span>Find Local Events in {country ? country.name : 'Your Area'}</span>
                </motion.button>
                <motion.button
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(holiday.name + ' celebrations ' + (country ? country.name : ''))}`)}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiMapPin} />
                  <span>Find Nearby in {country ? country.name : 'Your Area'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HolidayBlogPage;