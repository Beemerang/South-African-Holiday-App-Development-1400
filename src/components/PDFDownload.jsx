import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHolidays } from '../context/HolidayContext';
import { format, parseISO } from 'date-fns';

const { FiDownload } = FiIcons;

const PDFDownload = () => {
  const { filteredHolidays, selectedYear } = useHolidays();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      // Header
      doc.setFillColor(0, 122, 77); // SA Green
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('South African Public Holidays', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text(`Year: ${selectedYear}`, pageWidth / 2, 30, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      let yPosition = 60;
      
      // Add holidays
      filteredHolidays.forEach((holiday, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Holiday card background
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, 'F');
        
        // Holiday name
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(holiday.name, margin + 5, yPosition + 5);
        
        // Date
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 122, 77);
        const formattedDate = format(parseISO(holiday.date), 'EEEE, MMMM d, yyyy');
        doc.text(formattedDate, margin + 5, yPosition + 15);
        
        // Type badge
        doc.setFillColor(255, 182, 18); // SA Yellow
        doc.rect(pageWidth - margin - 40, yPosition, 35, 12, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(holiday.type, pageWidth - margin - 37, yPosition + 8);
        
        // Description
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(holiday.description, pageWidth - 2 * margin - 10);
        doc.text(splitDescription, margin + 5, yPosition + 25);
        
        yPosition += 45;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on ${format(new Date(), 'MMMM d, yyyy')} | Data sourced from SA Government`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      
      // Save the PDF
      doc.save(`SA-Public-Holidays-${selectedYear}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={generatePDF}
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
        icon={FiDownload} 
        className={isGenerating ? 'animate-pulse' : ''} 
      />
      <span className="hidden sm:inline">
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </span>
    </motion.button>
  );
};

export default PDFDownload;