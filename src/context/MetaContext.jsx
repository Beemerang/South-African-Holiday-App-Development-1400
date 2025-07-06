import React, { createContext, useContext, useState, useEffect } from 'react';

const MetaContext = createContext();

export const useMeta = () => {
  const context = useContext(MetaContext);
  if (!context) {
    throw new Error('useMeta must be used within a MetaProvider');
  }
  return context;
};

export const MetaProvider = ({ children }) => {
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    // Load meta data from localStorage
    const savedMeta = localStorage.getItem('global-holidays-meta');
    if (savedMeta) {
      setMetaData(JSON.parse(savedMeta));
    } else {
      // Initialize with default meta data for all pages
      const defaultMeta = {
        '/': {
          title: 'Global Public Holidays - Your Complete Guide to Worldwide Celebrations',
          description: 'Discover public holidays from every country around the world. Complete database with dates, traditions, and cultural significance.',
          keywords: 'public holidays, global holidays, international holidays, country holidays, cultural celebrations'
        },
        '/countries': {
          title: 'Countries - Browse Public Holidays Worldwide',
          description: 'Browse public holidays from all countries around the world. Search and filter by continent to find holiday information for any nation.',
          keywords: 'countries, public holidays, world holidays, international holidays, global calendar'
        },
        '/south-africa': {
          title: 'South African Public Holidays - Official Calendar & Dates',
          description: 'Complete list of South African public holidays with PDF calendar downloads, dates, and cultural significance of each celebration.',
          keywords: 'South Africa holidays, SA public holidays, Freedom Day, Heritage Day, Youth Day, South African calendar'
        },
        '/blog': {
          title: 'Holiday Blog - Cultural Stories & Traditions Worldwide',
          description: 'Read stories about public holidays, cultural celebrations, and traditions from around the world. Discover the meaning behind global festivities.',
          keywords: 'holiday blog, cultural stories, traditions, celebrations, holiday history, global culture'
        },
        '/admin': {
          title: 'Admin Dashboard - Global Holidays Management',
          description: 'Administrative interface for managing global holidays data, analytics, and content.',
          keywords: 'admin, dashboard, holidays management, analytics'
        }
      };
      setMetaData(defaultMeta);
      localStorage.setItem('global-holidays-meta', JSON.stringify(defaultMeta));
    }
  }, []);

  const updatePageMeta = (path, meta) => {
    const updatedMeta = {
      ...metaData,
      [path]: {
        ...metaData[path],
        ...meta
      }
    };
    setMetaData(updatedMeta);
    localStorage.setItem('global-holidays-meta', JSON.stringify(updatedMeta));
  };

  const getPageMeta = (path) => {
    return metaData[path] || {
      title: 'Global Public Holidays',
      description: 'Discover public holidays from around the world',
      keywords: 'public holidays, global holidays, international holidays'
    };
  };

  const generateCountryMeta = (countryCode, countryName) => {
    const path = `/country/${countryCode}`;
    if (!metaData[path]) {
      const meta = {
        title: `${countryName} Public Holidays - Complete Calendar & Dates`,
        description: `Complete list of public holidays in ${countryName}. Discover dates, traditions, and cultural significance of each holiday.`,
        keywords: `${countryName} holidays, ${countryName} public holidays, ${countryName} celebrations, ${countryName} traditions`
      };
      updatePageMeta(path, meta);
      return meta;
    }
    return metaData[path];
  };

  const generateHolidayMeta = (holidayId, holidayName, countryName) => {
    const path = `/holiday/${holidayId}`;
    if (!metaData[path]) {
      const meta = {
        title: `${holidayName} - ${countryName} Public Holiday Guide`,
        description: `Learn about ${holidayName}, its history, traditions, and how to celebrate this important ${countryName} holiday.`,
        keywords: `${holidayName}, ${countryName} holiday, holiday traditions, cultural celebration, holiday history`
      };
      updatePageMeta(path, meta);
      return meta;
    }
    return metaData[path];
  };

  const generateBlogPostMeta = (slug, title, excerpt) => {
    const path = `/blog/${slug}`;
    if (!metaData[path]) {
      const meta = {
        title: `${title} - Global Holidays Blog`,
        description: excerpt,
        keywords: `holiday blog, ${title.toLowerCase()}, cultural traditions, celebrations`
      };
      updatePageMeta(path, meta);
      return meta;
    }
    return metaData[path];
  };

  const value = {
    metaData,
    updatePageMeta,
    getPageMeta,
    generateCountryMeta,
    generateHolidayMeta,
    generateBlogPostMeta
  };

  return (
    <MetaContext.Provider value={value}>
      {children}
    </MetaContext.Provider>
  );
};