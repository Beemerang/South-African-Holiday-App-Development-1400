import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { getAllCountries, getCountryByCode } from '../data/countries';

const GlobalHolidayContext = createContext();

export const useGlobalHolidays = () => {
  const context = useContext(GlobalHolidayContext);
  if (!context) {
    throw new Error('useGlobalHolidays must be used within a GlobalHolidayProvider');
  }
  return context;
};

export const GlobalHolidayProvider = ({ children }) => {
  const [holidays, setHolidays] = useState({});
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCountry, setSelectedCountry] = useState('ZA'); // Default to South Africa
  const [loading, setLoading] = useState(true);

  // Generate a consistent ID for holidays
  const generateHolidayId = (name, year, countryCode) => {
    return `${countryCode}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${year}`;
  };

  // Calculate Easter date for a given year
  const calculateEaster = (year) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  };

  // Calculate Chinese New Year (approximate - varies by lunar calendar)
  const calculateChineseNewYear = (year) => {
    const dates = {
      2024: new Date(2024, 1, 10), // Feb 10
      2025: new Date(2025, 0, 29), // Jan 29
      2026: new Date(2026, 1, 17), // Feb 17
      2027: new Date(2027, 1, 6),  // Feb 6
      2028: new Date(2028, 0, 26), // Jan 26
      2029: new Date(2029, 1, 13), // Feb 13
      2030: new Date(2030, 1, 3),  // Feb 3
    };
    return dates[year] || new Date(year, 1, 10); // Default fallback
  };

  // Calculate Islamic holidays (approximate - varies by lunar calendar)
  const calculateEidAlFitr = (year) => {
    const dates = {
      2024: new Date(2024, 3, 10), // Apr 10
      2025: new Date(2025, 2, 30), // Mar 30
      2026: new Date(2026, 2, 20), // Mar 20
      2027: new Date(2027, 2, 9),  // Mar 9
      2028: new Date(2028, 1, 26), // Feb 26
      2029: new Date(2029, 1, 14), // Feb 14
      2030: new Date(2030, 1, 4),  // Feb 4
    };
    return dates[year] || new Date(year, 3, 10);
  };

  const calculateEidAlAdha = (year) => {
    const dates = {
      2024: new Date(2024, 5, 16), // Jun 16
      2025: new Date(2025, 5, 6),  // Jun 6
      2026: new Date(2026, 4, 26), // May 26
      2027: new Date(2027, 4, 16), // May 16
      2028: new Date(2028, 4, 4),  // May 4
      2029: new Date(2029, 3, 23), // Apr 23
      2030: new Date(2030, 3, 12), // Apr 12
    };
    return dates[year] || new Date(year, 5, 16);
  };

  // Get holidays for a specific country and year
  const getHolidaysForCountry = (countryCode, year) => {
    const holidayData = {
      // AFRICA
      'ZA': [ // South Africa
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Human Rights Day", month: 3, day: 21, description: "Commemorates the Sharpeville Massacre and celebrates human rights", type: "National" },
        { name: "Freedom Day", month: 4, day: 27, description: "Commemorates the first democratic elections in 1994", type: "National" },
        { name: "Workers' Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Youth Day", month: 6, day: 16, description: "Commemorates the 1976 Soweto uprising", type: "National" },
        { name: "National Women's Day", month: 8, day: 9, description: "Commemorates the 1956 women's march to the Union Buildings", type: "National" },
        { name: "Heritage Day", month: 9, day: 24, description: "Celebrates South Africa's cultural diversity", type: "National" },
        { name: "Day of Reconciliation", month: 12, day: 16, description: "Promotes reconciliation and national unity", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Day of Goodwill", month: 12, day: 26, description: "Boxing Day, promoting goodwill and charity", type: "National" }
      ],
      'NG': [ // Nigeria
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Children's Day", month: 5, day: 27, description: "Celebrates children and their rights", type: "National" },
        { name: "Democracy Day", month: 6, day: 12, description: "Commemorates Nigeria's return to democracy", type: "National" },
        { name: "Independence Day", month: 10, day: 1, description: "Commemorates Nigerian independence from Britain", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ],
      'KE': [ // Kenya
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Madaraka Day", month: 6, day: 1, description: "Commemorates self-governance", type: "National" },
        { name: "Mashujaa Day", month: 10, day: 20, description: "Honors national heroes", type: "National" },
        { name: "Jamhuri Day", month: 12, day: 12, description: "Commemorates independence and republic status", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ],
      'EG': [ // Egypt
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Coptic Christmas", month: 1, day: 7, description: "Coptic Orthodox celebration of Christ's birth", type: "Religious" },
        { name: "Revolution Day", month: 1, day: 25, description: "Commemorates the 2011 Egyptian Revolution", type: "National" },
        { name: "Sinai Liberation Day", month: 4, day: 25, description: "Commemorates the return of Sinai Peninsula", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Revolution Day July", month: 7, day: 23, description: "Commemorates the 1952 Egyptian Revolution", type: "National" }
      ],
      // ASIA
      'CN': [ // China
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Tomb Sweeping Day", month: 4, day: 4, description: "Traditional day to honor ancestors", type: "Cultural" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Dragon Boat Festival", month: 6, day: 10, description: "Traditional festival with boat races", type: "Cultural" },
        { name: "Mid Autumn Festival", month: 9, day: 17, description: "Traditional festival celebrating the harvest moon", type: "Cultural" },
        { name: "National Day", month: 10, day: 1, description: "Commemorates the founding of the People's Republic of China", type: "National" }
      ],
      'IN': [ // India
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Republic Day", month: 1, day: 26, description: "Commemorates the adoption of the Indian Constitution", type: "National" },
        { name: "Independence Day", month: 8, day: 15, description: "Commemorates India's independence from British rule", type: "National" },
        { name: "Gandhi Jayanti", month: 10, day: 2, description: "Celebrates the birthday of Mahatma Gandhi", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" }
      ],
      'JP': [ // Japan
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Coming of Age Day", month: 1, day: 8, description: "Celebrates young people reaching adulthood", type: "Cultural" },
        { name: "National Foundation Day", month: 2, day: 11, description: "Celebrates the founding of Japan", type: "National" },
        { name: "Showa Day", month: 4, day: 29, description: "Honors Emperor Showa's birthday", type: "National" },
        { name: "Constitution Memorial Day", month: 5, day: 3, description: "Commemorates the postwar constitution", type: "National" },
        { name: "Greenery Day", month: 5, day: 4, description: "Appreciates nature and the environment", type: "Cultural" },
        { name: "Children's Day", month: 5, day: 5, description: "Celebrates children and their happiness", type: "Cultural" }
      ],
      // EUROPE
      'GB': [ // United Kingdom
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "May Day", month: 5, day: 1, description: "Early May bank holiday", type: "National" },
        { name: "Spring Bank Holiday", month: 5, day: 27, description: "Late May bank holiday", type: "National" },
        { name: "Summer Bank Holiday", month: 8, day: 26, description: "Late August bank holiday", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ],
      'DE': [ // Germany
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "German Unity Day", month: 10, day: 3, description: "Commemorates German reunification", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Second Christmas Day", type: "Religious" }
      ],
      'FR': [ // France
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Victory in Europe Day", month: 5, day: 8, description: "Commemorates the end of World War II in Europe", type: "National" },
        { name: "Bastille Day", month: 7, day: 14, description: "French National Day", type: "National" },
        { name: "Assumption of Mary", month: 8, day: 15, description: "Catholic holiday honoring the Virgin Mary", type: "Religious" },
        { name: "All Saints' Day", month: 11, day: 1, description: "Christian holiday honoring all saints", type: "Religious" },
        { name: "Armistice Day", month: 11, day: 11, description: "Commemorates the end of World War I", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" }
      ],
      // NORTH AMERICA
      'US': [ // United States
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Martin Luther King Jr. Day", month: 1, day: 15, description: "Honors the civil rights leader", type: "National" },
        { name: "Presidents' Day", month: 2, day: 19, description: "Honors all U.S. presidents", type: "National" },
        { name: "Memorial Day", month: 5, day: 27, description: "Honors military personnel who died in service", type: "National" },
        { name: "Independence Day", month: 7, day: 4, description: "Commemorates the Declaration of Independence", type: "National" },
        { name: "Labor Day", month: 9, day: 2, description: "Celebrates the contributions of workers", type: "National" },
        { name: "Columbus Day", month: 10, day: 14, description: "Commemorates Christopher Columbus's arrival", type: "National" },
        { name: "Veterans Day", month: 11, day: 11, description: "Honors military veterans", type: "National" },
        { name: "Thanksgiving", month: 11, day: 28, description: "Traditional harvest celebration", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" }
      ],
      'CA': [ // Canada
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Family Day", month: 2, day: 19, description: "Celebrates the importance of families", type: "National" },
        { name: "Victoria Day", month: 5, day: 20, description: "Celebrates Queen Victoria's birthday", type: "National" },
        { name: "Canada Day", month: 7, day: 1, description: "Commemorates Canadian Confederation", type: "National" },
        { name: "Labour Day", month: 9, day: 2, description: "Celebrates the contributions of workers", type: "National" },
        { name: "Thanksgiving", month: 10, day: 14, description: "Traditional harvest celebration", type: "National" },
        { name: "Remembrance Day", month: 11, day: 11, description: "Honors military personnel", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ],
      // SOUTH AMERICA
      'BR': [ // Brazil
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Tiradentes", month: 4, day: 21, description: "Honors the Brazilian independence martyr", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Independence Day", month: 9, day: 7, description: "Commemorates Brazilian independence", type: "National" },
        { name: "Our Lady of Aparecida", month: 10, day: 12, description: "Patron saint of Brazil", type: "Religious" },
        { name: "All Souls' Day", month: 11, day: 2, description: "Day to remember the deceased", type: "Religious" },
        { name: "Proclamation of the Republic", month: 11, day: 15, description: "Commemorates the establishment of the republic", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" }
      ],
      'AR': [ // Argentina
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Labour Day", month: 5, day: 1, description: "International Workers' Day celebrating laborers", type: "National" },
        { name: "Revolution Day", month: 5, day: 25, description: "Commemorates the May Revolution", type: "National" },
        { name: "Flag Day", month: 6, day: 20, description: "Honors the Argentine flag", type: "National" },
        { name: "Independence Day", month: 7, day: 9, description: "Commemorates Argentine independence", type: "National" },
        { name: "San Martín Day", month: 8, day: 17, description: "Honors General José de San Martín", type: "National" },
        { name: "Columbus Day", month: 10, day: 12, description: "Day of Cultural Diversity", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" }
      ],
      // OCEANIA
      'AU': [ // Australia
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Australia Day", month: 1, day: 26, description: "Commemorates the arrival of the First Fleet", type: "National" },
        { name: "Labour Day", month: 3, day:11, description: "Celebrates workers and their contributions", type: "National" },
        { name: "ANZAC Day", month: 4, day: 25, description: "Honors Australian and New Zealand Army Corps", type: "National" },
        { name: "Queen's Birthday", month: 6, day: 10, description: "Celebrates the monarch's birthday", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ],
      'NZ': [ // New Zealand
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" },
        { name: "Day after New Year's Day", month: 1, day: 2, description: "Extended New Year celebration", type: "National" },
        { name: "Waitangi Day", month: 2, day: 6, description: "Commemorates the Treaty of Waitangi", type: "National" },
        { name: "ANZAC Day", month: 4, day: 25, description: "Honors Australian and New Zealand Army Corps", type: "National" },
        { name: "Queen's Birthday", month: 6, day: 3, description: "Celebrates the monarch's birthday", type: "National" },
        { name: "Labour Day", month: 10, day: 28, description: "Celebrates workers and their contributions", type: "National" },
        { name: "Christmas Day", month: 12, day: 25, description: "Christian holiday celebrating the birth of Jesus Christ", type: "Religious" },
        { name: "Boxing Day", month: 12, day: 26, description: "Traditional day for giving to the less fortunate", type: "National" }
      ]
    };

    // Enhanced default holidays for countries without specific data
    const getDefaultHolidays = (countryCode) => {
      const country = getCountryByCode(countryCode);
      const defaultSet = [
        { name: "New Year's Day", month: 1, day: 1, description: "The first day of the Gregorian calendar year", type: "National" }
      ];

      // Add Labour Day for most countries
      if (!['US'].includes(countryCode)) {
        defaultSet.push({
          name: "Labour Day",
          month: 5,
          day: 1,
          description: "International Workers' Day celebrating laborers",
          type: "National"
        });
      }

      // Add Christmas for Christian-majority countries
      if (country && !['SA', 'AE', 'IR', 'AF', 'PK', 'BD', 'ID', 'MY'].includes(countryCode)) {
        defaultSet.push({
          name: "Christmas Day",
          month: 12,
          day: 25,
          description: "Christian holiday celebrating the birth of Jesus Christ",
          type: "Religious"
        });
      }

      // Add Independence Day (generic date)
      defaultSet.push({
        name: "Independence Day",
        month: 7,
        day: 1,
        description: `${country ? country.name : 'National'} Independence Day`,
        type: "National"
      });

      // Add National Day
      defaultSet.push({
        name: "National Day",
        month: 12,
        day: 1,
        description: `${country ? country.name : 'National'} National Day`,
        type: "National"
      });

      return defaultSet;
    };

    const baseHolidays = holidayData[countryCode] || getDefaultHolidays(countryCode);

    // Calculate Easter for variable holidays
    const easter = calculateEaster(year);
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);

    // Add variable holidays for countries that observe them
    const variableHolidays = [];

    // Easter-based holidays for Christian countries
    if (['ZA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'CA', 'BR', 'AR', 'CL', 'CO', 'RO', 'PL', 'NL'].includes(countryCode)) {
      variableHolidays.push({
        name: "Good Friday",
        date: goodFriday,
        description: "Christian holiday commemorating the crucifixion of Jesus Christ",
        type: "Religious"
      });
    }

    if (['ZA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'CA', 'BR', 'AR', 'CL', 'CO', 'RO', 'PL', 'NL'].includes(countryCode)) {
      variableHolidays.push({
        name: "Easter Monday",
        date: easterMonday,
        description: "Day after Easter Sunday, celebrating the resurrection of Jesus Christ",
        type: "Religious"
      });
    }

    // Add Islamic holidays for Muslim countries
    if (['EG', 'ID', 'PK', 'BD', 'IR', 'TR', 'SA', 'AE', 'MY', 'AF', 'DZ', 'MA', 'SD'].includes(countryCode)) {
      const eidAlFitr = calculateEidAlFitr(year);
      const eidAlAdha = calculateEidAlAdha(year);
      variableHolidays.push(
        {
          name: "Eid al-Fitr",
          date: eidAlFitr,
          description: "Islamic holiday marking the end of Ramadan",
          type: "Religious"
        },
        {
          name: "Eid al-Adha",
          date: eidAlAdha,
          description: "Islamic holiday commemorating Abraham's sacrifice",
          type: "Religious"
        }
      );
    }

    // Add Chinese New Year for countries that celebrate it
    if (['CN', 'SG', 'MY', 'TH', 'VN', 'ID'].includes(countryCode)) {
      const chineseNewYear = calculateChineseNewYear(year);
      variableHolidays.push({
        name: "Chinese New Year",
        date: chineseNewYear,
        description: "Traditional Chinese lunar new year celebration",
        type: "Cultural"
      });
    }

    const fixedHolidays = baseHolidays.map((holiday) => ({
      id: generateHolidayId(holiday.name, year, countryCode),
      name: holiday.name,
      date: `${year}-${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`,
      description: holiday.description,
      type: holiday.type,
      countryCode: countryCode,
      observed: true
    }));

    const variableHolidaysFormatted = variableHolidays.map((holiday) => ({
      id: generateHolidayId(holiday.name, year, countryCode),
      name: holiday.name,
      date: holiday.date.toISOString().split('T')[0],
      description: holiday.description,
      type: holiday.type,
      countryCode: countryCode,
      observed: true
    }));

    return [...fixedHolidays, ...variableHolidaysFormatted].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  // Function to get a specific holiday by ID
  const getHolidayById = (holidayId) => {
    // Extract country code and year from holiday ID
    const parts = holidayId.split('-');
    if (parts.length < 3) return null;
    
    const countryCode = parts[0];
    const year = parseInt(parts[parts.length - 1]);
    
    if (!countryCode || !year) return null;
    
    // Get all holidays for that country and year
    const countryHolidays = getHolidaysForCountry(countryCode, year);
    
    // Find the specific holiday
    return countryHolidays.find(holiday => holiday.id === holidayId);
  };

  useEffect(() => {
    const loadHolidays = async () => {
      setLoading(true);
      
      // Generate holidays for all countries and years
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        years.push(i);
      }
      
      const allCountries = getAllCountries();
      const holidaysByCountry = {};
      
      allCountries.forEach(country => {
        holidaysByCountry[country.code] = [];
        years.forEach(year => {
          const yearHolidays = getHolidaysForCountry(country.code, year);
          holidaysByCountry[country.code].push(...yearHolidays);
        });
      });
      
      setHolidays(holidaysByCountry);
      setLoading(false);
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    const countryHolidays = holidays[selectedCountry] || [];
    let filtered = countryHolidays.filter(holiday => {
      const holidayYear = new Date(holiday.date).getFullYear();
      return holidayYear === selectedYear;
    });

    if (searchTerm) {
      filtered = filtered.filter(holiday =>
        holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHolidays(filtered);
  }, [holidays, searchTerm, selectedYear, selectedCountry]);

  const updateHolidays = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Regenerate holidays (in a real app, this would fetch from APIs)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      years.push(i);
    }
    
    const allCountries = getAllCountries();
    const holidaysByCountry = {};
    
    allCountries.forEach(country => {
      holidaysByCountry[country.code] = [];
      years.forEach(year => {
        const yearHolidays = getHolidaysForCountry(country.code, year);
        holidaysByCountry[country.code].push(...yearHolidays);
      });
    });
    
    setHolidays(holidaysByCountry);
    setLoading(false);
  };

  const searchCountries = (query) => {
    if (!query) return [];
    
    const allCountries = getAllCountries();
    return allCountries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase()) ||
      country.code.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  };

  const value = {
    holidays,
    filteredHolidays,
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    selectedCountry,
    setSelectedCountry,
    loading,
    updateHolidays,
    searchCountries,
    getHolidaysForCountry,
    getHolidayById
  };

  return (
    <GlobalHolidayContext.Provider value={value}>
      {children}
    </GlobalHolidayContext.Provider>
  );
};