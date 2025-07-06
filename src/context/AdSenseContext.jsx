import React, { createContext, useContext, useState, useEffect } from 'react';

const AdSenseContext = createContext();

export const useAdSense = () => {
  const context = useContext(AdSenseContext);
  if (!context) {
    throw new Error('useAdSense must be used within an AdSenseProvider');
  }
  return context;
};

export const AdSenseProvider = ({ children }) => {
  const [adSenseConfig, setAdSenseConfig] = useState({
    publisherId: '',
    headerSlot: '',
    sidebarSlot: '',
    footerSlot: '',
    enabled: false,
    // New toggle settings for content vs ads
    showHeaderContent: true,
    showSidebarContent: true,
    showFooterContent: true
  });

  useEffect(() => {
    // Load AdSense configuration from localStorage
    const savedConfig = localStorage.getItem('sa-holidays-adsense');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      // Ensure new properties exist with defaults
      setAdSenseConfig({
        publisherId: parsed.publisherId || '',
        headerSlot: parsed.headerSlot || '',
        sidebarSlot: parsed.sidebarSlot || '',
        footerSlot: parsed.footerSlot || '',
        enabled: parsed.enabled || false,
        showHeaderContent: parsed.showHeaderContent !== undefined ? parsed.showHeaderContent : true,
        showSidebarContent: parsed.showSidebarContent !== undefined ? parsed.showSidebarContent : true,
        showFooterContent: parsed.showFooterContent !== undefined ? parsed.showFooterContent : true
      });
    }
  }, []);

  const updateAdSenseConfig = (config) => {
    setAdSenseConfig(config);
    localStorage.setItem('sa-holidays-adsense', JSON.stringify(config));
  };

  const toggleContentDisplay = (position, show) => {
    const updated = {
      ...adSenseConfig,
      [`show${position.charAt(0).toUpperCase() + position.slice(1)}Content`]: show
    };
    updateAdSenseConfig(updated);
  };

  const value = {
    adSenseConfig,
    updateAdSenseConfig,
    toggleContentDisplay
  };

  return (
    <AdSenseContext.Provider value={value}>
      {children}
    </AdSenseContext.Provider>
  );
};