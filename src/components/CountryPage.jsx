import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';
import { useContent } from '../context/ContentContext';
import { useMeta } from '../context/MetaContext';
import { getCountryByCode } from '../data/countries';
import CountryHolidaysList from './CountryHolidaysList';
import LoadingSpinner from './LoadingSpinner';
import MetaEditor from './MetaEditor';
import AdSenseAd from './AdSenseAd';

const CountryPage = ({ isAdmin }) => {
  const { countryCode } = useParams();
  const { setSelectedCountry, loading } = useGlobalHolidays();
  const { getCountryDescription } = useContent();
  const { generateCountryMeta, getPageMeta } = useMeta();
  
  const country = getCountryByCode(countryCode);
  const countryDescription = getCountryDescription(countryCode);
  const currentPath = `/country/${countryCode}`;

  React.useEffect(() => {
    if (countryCode) {
      setSelectedCountry(countryCode);
    }
  }, [countryCode, setSelectedCountry]);

  useEffect(() => {
    if (country) {
      const meta = generateCountryMeta(countryCode, country.name);
      
      // Update document meta tags
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
  }, [country, countryCode, generateCountryMeta]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!country) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Country Not Found</h2>
        <p className="text-gray-600">The country you're looking for doesn't exist in our database.</p>
      </div>
    );
  }

  const pageMeta = getPageMeta(currentPath);

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta property="og:title" content={`${country.name} Public Holidays`} />
        <meta property="og:description" content={`Complete list of public holidays in ${country.name}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${country.name} Public Holidays`,
            "description": `Complete list of public holidays in ${country.name}`,
            "url": window.location.href,
            "about": {
              "@type": "Country",
              "name": country.name
            }
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Meta Editor for Admin */}
        <MetaEditor path={currentPath} isAdmin={isAdmin} />

        {/* Header AdSense */}
        <AdSenseAd slot="1234567890" position="header" isAdmin={isAdmin} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CountryHolidaysList isAdmin={isAdmin} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdSenseAd slot="0987654321" position="sidebar" isAdmin={isAdmin} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CountryPage;