import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useMeta } from '../context/MetaContext';

const { FiEdit3, FiSave, FiX, FiTag } = FiIcons;

const MetaEditor = ({ path, isAdmin }) => {
  const { getPageMeta, updatePageMeta } = useMeta();
  const [isEditing, setIsEditing] = useState(false);
  const [meta, setMeta] = useState(getPageMeta(path));

  React.useEffect(() => {
    setMeta(getPageMeta(path));
  }, [path, getPageMeta]);

  const handleSave = () => {
    updatePageMeta(path, meta);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMeta(getPageMeta(path));
    setIsEditing(false);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <motion.div
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-yellow-800 flex items-center space-x-2">
          <SafeIcon icon={FiTag} />
          <span>SEO Meta Data - {path}</span>
        </h3>
        
        {isEditing ? (
          <div className="flex space-x-2">
            <motion.button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors text-sm"
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
            className="flex items-center space-x-1 px-3 py-1 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiEdit3} />
            <span>Edit Meta</span>
          </motion.button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sa-green focus:border-transparent"
              placeholder="Page title..."
            />
            <p className="text-xs text-gray-500 mt-1">{meta.title.length}/60 chars</p>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sa-green focus:border-transparent h-16 resize-vertical"
              placeholder="Page description..."
            />
            <p className="text-xs text-gray-500 mt-1">{meta.description.length}/160 chars</p>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Keywords</label>
            <input
              type="text"
              value={meta.keywords}
              onChange={(e) => setMeta({ ...meta, keywords: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sa-green focus:border-transparent"
              placeholder="keyword1, keyword2, keyword3..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Title:</span>
            <p className="text-gray-600">{meta.title}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Description:</span>
            <p className="text-gray-600">{meta.description}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Keywords:</span>
            <p className="text-gray-600">{meta.keywords}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MetaEditor;