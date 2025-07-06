import { useState, useEffect } from 'react';
import { getCountryByCode } from '../data/countries';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Try to get user's location from various sources
        let countryCode = null;

        // Method 1: Try timezone-based detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneCountryMap = {
          'Africa/Johannesburg': 'ZA',
          'America/New_York': 'US',
          'America/Los_Angeles': 'US',
          'America/Chicago': 'US',
          'Europe/London': 'GB',
          'Europe/Paris': 'FR',
          'Europe/Berlin': 'DE',
          'Asia/Tokyo': 'JP',
          'Asia/Shanghai': 'CN',
          'Asia/Kolkata': 'IN',
          'Australia/Sydney': 'AU',
          'America/Toronto': 'CA',
          'America/Mexico_City': 'MX',
          'America/Sao_Paulo': 'BR',
          // Add more timezone mappings as needed
        };

        countryCode = timezoneCountryMap[timezone];

        // Method 2: Try language-based detection (fallback)
        if (!countryCode) {
          const language = navigator.language || navigator.languages[0];
          const languageCountryMap = {
            'en-US': 'US',
            'en-GB': 'GB',
            'en-CA': 'CA',
            'en-AU': 'AU',
            'en-ZA': 'ZA',
            'fr-FR': 'FR',
            'fr-CA': 'CA',
            'de-DE': 'DE',
            'es-ES': 'ES',
            'es-MX': 'MX',
            'pt-BR': 'BR',
            'ja-JP': 'JP',
            'zh-CN': 'CN',
            'hi-IN': 'IN',
            // Add more language mappings as needed
          };

          countryCode = languageCountryMap[language] || languageCountryMap[language?.split('-')[0]];
        }

        // Method 3: Default fallback
        if (!countryCode) {
          countryCode = 'US'; // Default to US if detection fails
        }

        const country = getCountryByCode(countryCode);
        if (country) {
          setUserLocation(country);
        }
      } catch (error) {
        console.log('Location detection failed:', error);
        // Fallback to US if all methods fail
        const fallbackCountry = getCountryByCode('US');
        setUserLocation(fallbackCountry);
      } finally {
        setLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  return { userLocation, loading };
};