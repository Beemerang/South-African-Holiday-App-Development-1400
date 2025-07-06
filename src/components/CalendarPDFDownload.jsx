import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGlobalHolidays } from '../context/GlobalHolidayContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { getCountryByCode } from '../data/countries';

const { FiDownload, FiCalendar } = FiIcons;

const CalendarPDFDownload = () => {
  const { filteredHolidays, selectedYear, selectedCountry } = useGlobalHolidays();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const country = getCountryByCode(selectedCountry);

  const generateCalendarPDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      
      // Create holiday lookup by date
      const holidayLookup = {};
      filteredHolidays.forEach(holiday => {
        const dateKey = format(parseISO(holiday.date), 'yyyy-MM-dd');
        holidayLookup[dateKey] = holiday;
      });

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Title page
      doc.setFillColor(0, 122, 77); // SA Green
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text(
        `${country ? country.name : 'Global'} Public Holidays`,
        pageWidth / 2,
        30,
        { align: 'center' }
      );
      
      doc.setFontSize(18);
      doc.text(
        selectedYear.toString(),
        pageWidth / 2,
        45,
        { align: 'center' }
      );
      
      // Holiday summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Holiday Summary', margin, 80);
      
      let yPos = 95;
      doc.setFontSize(10);
      
      filteredHolidays.forEach((holiday, index) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 20;
        }
        
        // Holiday date
        doc.setFont(undefined, 'bold');
        const dateStr = format(parseISO(holiday.date), 'MMM dd');
        doc.text(dateStr, margin, yPos);
        
        // Holiday name
        doc.setFont(undefined, 'normal');
        doc.text(holiday.name, margin + 25, yPos);
        
        // Holiday type
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`(${holiday.type})`, margin + 25, yPos + 4);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPos += 12;
      });
      
      // Calendar pages (3 months per page)
      for (let monthIndex = 0; monthIndex < 12; monthIndex += 3) {
        doc.addPage();
        
        // Page header
        doc.setFillColor(0, 35, 149); // SA Blue
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text(
          `${selectedYear} Calendar - ${months[monthIndex]} to ${months[Math.min(monthIndex + 2, 11)]}`,
          pageWidth / 2,
          15,
          { align: 'center' }
        );
        
        doc.setTextColor(0, 0, 0);
        
        // Draw 3 months
        for (let i = 0; i < 3 && monthIndex + i < 12; i++) {
          const currentMonth = monthIndex + i;
          const x = margin + (i * (contentWidth / 3));
          const y = 35;
          const monthWidth = contentWidth / 3 - 5;
          const monthHeight = 85;
          
          drawMonth(doc, x, y, monthWidth, monthHeight, currentMonth, selectedYear, holidayLookup, months, dayNames);
        }
      }
      
      // Footer on each page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Generated on ${format(new Date(), 'MMMM d, yyyy')} | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`${country ? country.name : 'Global'}-Holidays-Calendar-${selectedYear}.pdf`);
      
    } catch (error) {
      console.error('Error generating calendar PDF:', error);
      alert('Error generating calendar PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const drawMonth = (doc, x, y, width, height, monthIndex, year, holidayLookup, months, dayNames) => {
    const monthStart = startOfMonth(new Date(year, monthIndex));
    const monthEnd = endOfMonth(new Date(year, monthIndex));
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);
    
    // Month header
    doc.setFillColor(255, 182, 18); // SA Yellow
    doc.rect(x, y, width, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(months[monthIndex], x + width / 2, y + 5.5, { align: 'center' });
    
    // Day headers
    const dayHeaderHeight = 6;
    const cellWidth = width / 7;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y + 8, width, dayHeaderHeight, 'F');
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    
    dayNames.forEach((dayName, index) => {
      doc.text(
        dayName,
        x + index * cellWidth + cellWidth / 2,
        y + 8 + dayHeaderHeight / 2 + 1,
        { align: 'center' }
      );
    });
    
    // Calendar grid
    const calendarHeight = height - 8 - dayHeaderHeight;
    const rowHeight = calendarHeight / 6;
    let currentWeek = 0;
    let currentDay = 0;
    
    // Draw empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      drawDayCell(doc, x + i * cellWidth, y + 8 + dayHeaderHeight + currentWeek * rowHeight, cellWidth, rowHeight, '', false);
      currentDay++;
    }
    
    // Draw month days
    monthDays.forEach((date, index) => {
      const dayNumber = format(date, 'd');
      const dateKey = format(date, 'yyyy-MM-dd');
      const isHoliday = holidayLookup[dateKey];
      
      if (currentDay % 7 === 0 && currentDay > 0) {
        currentWeek++;
      }
      
      const dayX = x + (currentDay % 7) * cellWidth;
      const dayY = y + 8 + dayHeaderHeight + currentWeek * rowHeight;
      
      drawDayCell(doc, dayX, dayY, cellWidth, rowHeight, dayNumber, isHoliday);
      currentDay++;
    });
    
    // Draw grid lines
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    
    // Vertical lines
    for (let i = 0; i <= 7; i++) {
      doc.line(x + i * cellWidth, y + 8, x + i * cellWidth, y + height);
    }
    
    // Horizontal lines
    for (let i = 0; i <= 7; i++) {
      const lineY = y + 8 + i * (i === 0 ? 0 : i === 1 ? dayHeaderHeight : rowHeight);
      if (lineY <= y + height) {
        doc.line(x, lineY, x + width, lineY);
      }
    }
  };

  const drawDayCell = (doc, x, y, width, height, dayNumber, isHoliday) => {
    if (isHoliday) {
      doc.setFillColor(220, 38, 49, 0.2); // SA Red with transparency
      doc.rect(x, y, width, height, 'F');
    }
    
    if (dayNumber) {
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(dayNumber, x + 1, y + 6);
      
      if (isHoliday) {
        doc.setFontSize(5);
        doc.setTextColor(220, 38, 49);
        doc.setFont(undefined, 'normal');
        const holidayName = isHoliday.name;
        const maxWidth = width - 2;
        
        // Split long holiday names
        const words = holidayName.split(' ');
        let line = '';
        let lineY = y + 10;
        
        words.forEach((word, index) => {
          const testLine = line + (line ? ' ' : '') + word;
          const textWidth = doc.getTextWidth(testLine);
          
          if (textWidth > maxWidth && line) {
            doc.text(line, x + 1, lineY);
            line = word;
            lineY += 3;
          } else {
            line = testLine;
          }
          
          if (index === words.length - 1) {
            doc.text(line, x + 1, lineY);
          }
        });
      }
    }
  };

  return (
    <motion.button
      onClick={generateCalendarPDF}
      disabled={isGenerating || filteredHolidays.length === 0}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isGenerating || filteredHolidays.length === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-sa-blue text-white hover:bg-sa-blue/90'
      }`}
      whileHover={{ scale: isGenerating ? 1 : 1.05 }}
      whileTap={{ scale: isGenerating ? 1 : 0.95 }}
    >
      <SafeIcon 
        icon={isGenerating ? FiCalendar : FiDownload} 
        className={isGenerating ? 'animate-pulse' : ''} 
      />
      <span className="hidden sm:inline">
        {isGenerating ? 'Generating Calendar...' : 'Download Calendar PDF'}
      </span>
    </motion.button>
  );
};

export default CalendarPDFDownload;