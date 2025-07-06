import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [homeContent, setHomeContent] = useState({
    title: 'Global Public Holidays',
    subtitle: 'Your Complete Guide to Public Holidays Around the World',
    description: `Welcome to the world's most comprehensive database of public holidays! Our mission is to provide accurate, up-to-date information about public holidays celebrated in every country around the globe.

Whether you're planning international travel, coordinating with global teams, or simply curious about cultural celebrations worldwide, we've got you covered. Our database includes detailed information about each holiday's history, traditions, and significance.

From national independence days to religious observances, from cultural festivals to international awareness days - discover the rich tapestry of celebrations that mark the calendar year in countries across all continents.

Our information is sourced directly from official government websites and verified regularly to ensure accuracy. We believe that understanding public holidays helps foster cultural awareness and global connectivity.`,
    images: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        alt: 'Global celebration with fireworks',
        caption: 'Celebrating diversity across cultures'
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=600&fit=crop',
        alt: 'Calendar with marked dates',
        caption: 'Planning your year with global holidays'
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&h=600&fit=crop',
        alt: 'World map with pins',
        caption: 'Holidays from every corner of the world'
      }
    ]
  });

  const [countryDescriptions, setCountryDescriptions] = useState({});

  useEffect(() => {
    // Load content from localStorage
    const savedHomeContent = localStorage.getItem('global-holidays-home-content');
    if (savedHomeContent) {
      setHomeContent(JSON.parse(savedHomeContent));
    }

    const savedCountryDescriptions = localStorage.getItem('global-holidays-country-descriptions');
    if (savedCountryDescriptions) {
      setCountryDescriptions(JSON.parse(savedCountryDescriptions));
    } else {
      // Initialize with default descriptions
      const defaultDescriptions = {
        'ZA': `South Africa observes 12 public holidays annually, reflecting the country's diverse cultural heritage and historic journey to democracy. These holidays commemorate important events in South African history, from the struggle against apartheid to the celebration of cultural diversity.

The holidays include significant days like Freedom Day (April 27), which marks the first democratic elections in 1994, and Heritage Day (September 24), celebrating the nation's cultural diversity. Many holidays also reflect the country's commitment to human rights and reconciliation.

South African public holidays are observed nationwide, with most businesses and government offices closed. The holidays provide opportunities for reflection, celebration, and community bonding across the Rainbow Nation.`,
        'US': `The United States observes federal holidays that reflect the nation's history, values, and diverse cultural heritage. These holidays range from celebrating the founding of the nation to honoring the contributions of various groups and individuals.

Federal holidays include Independence Day (July 4), commemorating the Declaration of Independence, and Martin Luther King Jr. Day, honoring the civil rights leader. Other holidays celebrate labor contributions, veterans, and important historical events.

While federal holidays are observed by government agencies and many businesses, individual states may also observe additional holidays. The holiday calendar reflects America's journey as a nation and its ongoing commitment to liberty, equality, and justice.`,
        'GB': `The United Kingdom observes bank holidays and public holidays that vary slightly between England, Wales, Scotland, and Northern Ireland. These holidays have evolved from religious observances and royal proclamations to include modern celebrations.

Traditional holidays include Christmas Day, Boxing Day, and Easter Monday, reflecting the country's Christian heritage. The Spring Bank Holiday and Summer Bank Holiday provide extended weekends for rest and recreation.

The UK's holiday calendar balances tradition with modern needs, offering citizens time for family, community activities, and cultural celebrations. Special occasions like the Queen's Birthday and Jubilee celebrations mark important royal milestones.`
      };
      setCountryDescriptions(defaultDescriptions);
      localStorage.setItem('global-holidays-country-descriptions', JSON.stringify(defaultDescriptions));
    }
  }, []);

  const updateHomeContent = (newContent) => {
    setHomeContent(newContent);
    localStorage.setItem('global-holidays-home-content', JSON.stringify(newContent));
  };

  const updateCountryDescription = (countryCode, description) => {
    const updatedDescriptions = {
      ...countryDescriptions,
      [countryCode]: description
    };
    setCountryDescriptions(updatedDescriptions);
    localStorage.setItem('global-holidays-country-descriptions', JSON.stringify(updatedDescriptions));
  };

  const getCountryDescription = (countryCode) => {
    return countryDescriptions[countryCode] || `Explore the public holidays of this country, including national days, religious observances, and cultural celebrations. Each holiday reflects the unique history, traditions, and values of the nation.

These holidays provide insight into the country's cultural heritage and offer opportunities for celebration, reflection, and community bonding. From historical commemorations to religious festivals, each holiday tells a story of the nation's journey and identity.

Stay updated with accurate information about dates, observances, and the significance of each holiday throughout the year.`;
  };

  const value = {
    homeContent,
    updateHomeContent,
    countryDescriptions,
    updateCountryDescription,
    getCountryDescription
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};