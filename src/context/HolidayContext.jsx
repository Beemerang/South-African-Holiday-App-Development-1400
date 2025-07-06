import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const HolidayContext = createContext();

export const useHolidays = () => {
  const context = useContext(HolidayContext);
  if (!context) {
    throw new Error('useHolidays must be used within a HolidayProvider');
  }
  return context;
};

export const HolidayProvider = ({ children }) => {
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Generate a consistent ID for holidays
  const generateHolidayId = (name, year) => {
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${year}`;
  };

  // Generate holidays for multiple years
  const generateHolidaysForYear = (year) => {
    const baseHolidays = [
      {
        name: "New Year's Day",
        month: 1,
        day: 1,
        description: "The first day of the Gregorian calendar year",
        type: "National"
      },
      {
        name: "Human Rights Day",
        month: 3,
        day: 21,
        description: "Commemorates the Sharpeville Massacre and celebrates human rights",
        type: "National"
      },
      {
        name: "Freedom Day",
        month: 4,
        day: 27,
        description: "Commemorates the first democratic elections in 1994",
        type: "National"
      },
      {
        name: "Workers' Day",
        month: 5,
        day: 1,
        description: "International Workers' Day celebrating laborers",
        type: "National"
      },
      {
        name: "Youth Day",
        month: 6,
        day: 16,
        description: "Commemorates the 1976 Soweto uprising",
        type: "National"
      },
      {
        name: "National Women's Day",
        month: 8,
        day: 9,
        description: "Commemorates the 1956 women's march to the Union Buildings",
        type: "National"
      },
      {
        name: "Heritage Day",
        month: 9,
        day: 24,
        description: "Celebrates South Africa's cultural diversity",
        type: "National"
      },
      {
        name: "Day of Reconciliation",
        month: 12,
        day: 16,
        description: "Promotes reconciliation and national unity",
        type: "National"
      },
      {
        name: "Christmas Day",
        month: 12,
        day: 25,
        description: "Christian holiday celebrating the birth of Jesus Christ",
        type: "Religious"
      },
      {
        name: "Day of Goodwill",
        month: 12,
        day: 26,
        description: "Boxing Day, promoting goodwill and charity",
        type: "National"
      }
    ];

    // Calculate Easter for variable holidays
    const easter = calculateEaster(year);
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    const familyDay = new Date(easter);
    familyDay.setDate(easter.getDate() + 1);

    const variableHolidays = [
      {
        name: "Good Friday",
        date: goodFriday,
        description: "Christian holiday commemorating the crucifixion of Jesus Christ",
        type: "Religious"
      },
      {
        name: "Family Day",
        date: familyDay,
        description: "Day after Easter Sunday, celebrating family unity",
        type: "National"
      }
    ];

    const fixedHolidays = baseHolidays.map((holiday) => ({
      id: generateHolidayId(holiday.name, year),
      name: holiday.name,
      date: `${year}-${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`,
      description: holiday.description,
      type: holiday.type,
      observed: true
    }));

    const variableHolidaysFormatted = variableHolidays.map((holiday) => ({
      id: generateHolidayId(holiday.name, year),
      name: holiday.name,
      date: holiday.date.toISOString().split('T')[0],
      description: holiday.description,
      type: holiday.type,
      observed: true
    }));

    return [...fixedHolidays, ...variableHolidaysFormatted].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
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

  useEffect(() => {
    const loadHolidays = async () => {
      setLoading(true);
      
      // Generate holidays for current year and surrounding years
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 10; i++) {
        years.push(i);
      }

      const allHolidays = [];
      years.forEach(year => {
        const yearHolidays = generateHolidaysForYear(year);
        allHolidays.push(...yearHolidays);
      });

      console.log('Generated holidays:', allHolidays.slice(0, 5)); // Debug log
      setHolidays(allHolidays);
      setLoading(false);
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    let filtered = holidays.filter(holiday => {
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

    console.log('Filtered holidays:', filtered.map(h => ({ id: h.id, name: h.name }))); // Debug log
    setFilteredHolidays(filtered);
  }, [holidays, searchTerm, selectedYear]);

  const updateHolidays = async () => {
    setLoading(true);
    // Simulate API call to government source
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would fetch updated data from SA government API
    // For now, we'll just regenerate the holidays
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i);
    }

    const allHolidays = [];
    years.forEach(year => {
      const yearHolidays = generateHolidaysForYear(year);
      allHolidays.push(...yearHolidays);
    });

    setHolidays(allHolidays);
    setLoading(false);
  };

  const value = {
    holidays,
    filteredHolidays,
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    loading,
    updateHolidays
  };

  return (
    <HolidayContext.Provider value={value}>
      {children}
    </HolidayContext.Provider>
  );
};