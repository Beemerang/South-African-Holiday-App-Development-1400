import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAdSense } from '../context/AdSenseContext';

const { FiEdit3, FiSave, FiX, FiImage } = FiIcons;

const FooterContent = ({ isAdmin }) => {
  const { adSenseConfig } = useAdSense();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    title: 'Global Public Holidays',
    description: 'Your trusted source for accurate public holiday information from every country around the world.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop',
    links: [
      { label: 'About Us', url: '#' },
      { label: 'Contact', url: '#' },
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' }
    ]
  });

  React.useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('footer-content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('footer-content', JSON.stringify(content));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedContent = localStorage.getItem('footer-content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
    setIsEditing(false);
  };

  // Don't show footer content if it's disabled (showing ads instead)
  if (!adSenseConfig.showFooterContent) {
    return null;
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isAdmin && (
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <div className="flex space-x-2">
              <motion.button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 bg-white text-sa-green rounded-lg hover:bg-gray-100 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiSave} />
                <span>Save</span>
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiX} />
                <span>Cancel</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-white text-sa-green rounded-lg hover:bg-gray-100 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiEdit3} />
              <span>Edit Footer</span>
            </motion.button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-black placeholder-gray-700 focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Footer Title"
              />
              <textarea
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-black placeholder-gray-700 focus:ring-2 focus:ring-white focus:border-transparent h-24 resize-vertical"
                placeholder="Footer Description"
              />
              <input
                type="text"
                value={content.image}
                onChange={(e) => setContent({ ...content, image: e.target.value })}
                className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-black placeholder-gray-700 focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Image URL"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
              <p className="text-white/90 mb-4 leading-relaxed">
                {content.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {content.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {isEditing && (
            <div className="absolute top-2 right-2 z-10">
              <SafeIcon icon={FiImage} className="text-white bg-black/50 p-1 rounded" />
            </div>
          )}
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FooterContent;