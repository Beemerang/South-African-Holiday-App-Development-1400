import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHolidays } from '../context/HolidayContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAdSense } from '../context/AdSenseContext';
import AnalyticsDashboard from './AnalyticsDashboard';

const { FiRefreshCw, FiDatabase, FiCheckCircle, FiAlertTriangle, FiBarChart3, FiSettings, FiDollarSign, FiSave, FiUsers, FiCalendar, FiGlobe, FiTrendingUp, FiToggleLeft, FiToggleRight } = FiIcons;

const AdminPanel = () => {
  const { updateHolidays, loading } = useHolidays();
  const { trackAdminAction } = useAnalytics();
  const { adSenseConfig, updateAdSenseConfig, toggleContentDisplay } = useAdSense();
  const [lastUpdate, setLastUpdate] = useState(localStorage.getItem('lastUpdate') || 'Never');
  const [updateStatus, setUpdateStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [adSenseForm, setAdSenseForm] = useState(adSenseConfig);
  const [adSenseSaveStatus, setAdSenseSaveStatus] = useState('');

  const handleUpdate = async () => {
    setUpdateStatus('updating');
    trackAdminAction('data_update_initiated');
    
    try {
      await updateHolidays();
      const now = new Date().toLocaleString();
      setLastUpdate(now);
      localStorage.setItem('lastUpdate', now);
      setUpdateStatus('success');
      trackAdminAction('data_update_success');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (error) {
      setUpdateStatus('error');
      trackAdminAction('data_update_error', { error: error.message });
      setTimeout(() => setUpdateStatus(''), 3000);
    }
  };

  const handleAdSenseSave = () => {
    updateAdSenseConfig(adSenseForm);
    setAdSenseSaveStatus('success');
    trackAdminAction('adsense_config_updated');
    setTimeout(() => setAdSenseSaveStatus(''), 3000);
  };

  const handleContentToggle = (position, currentState) => {
    const newState = !currentState;
    const updatedConfig = {
      ...adSenseForm,
      [`show${position.charAt(0).toUpperCase() + position.slice(1)}Content`]: newState
    };
    setAdSenseForm(updatedConfig);
    updateAdSenseConfig(updatedConfig);
    trackAdminAction('content_display_toggled', { position, enabled: newState });
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive ? 'bg-sa-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SafeIcon icon={icon} />
      <span>{label}</span>
    </motion.button>
  );

  const StatCard = ({ title, value, icon, color, description }) => (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <SafeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );

  const ContentToggle = ({ position, label, enabled }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium text-gray-800">{label}</h4>
        <p className="text-sm text-gray-600">
          {enabled ? 'Showing custom content' : 'Showing AdSense ads'}
        </p>
      </div>
      <button
        onClick={() => handleContentToggle(position, enabled)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          enabled 
            ? 'bg-sa-green text-white hover:bg-sa-green/90' 
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        <SafeIcon icon={enabled ? FiToggleRight : FiToggleLeft} />
        <span>{enabled ? 'Content ON' : 'Ads ON'}</span>
      </button>
    </div>
  );

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your global holidays platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <TabButton
            id="overview"
            label="Overview"
            icon={FiTrendingUp}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="data"
            label="Data Management"
            icon={FiDatabase}
            isActive={activeTab === 'data'}
            onClick={setActiveTab}
          />
          <TabButton
            id="analytics"
            label="Analytics"
            icon={FiBarChart3}
            isActive={activeTab === 'analytics'}
            onClick={setActiveTab}
          />
          <TabButton
            id="adsense"
            label="AdSense Settings"
            icon={FiDollarSign}
            isActive={activeTab === 'adsense'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Platform Overview</h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Countries"
                value="195+"
                icon={FiGlobe}
                color="bg-sa-green"
                description="Countries with holiday data"
              />
              <StatCard
                title="Total Holidays"
                value="1,000+"
                icon={FiCalendar}
                color="bg-sa-blue"
                description="Holidays documented"
              />
              <StatCard
                title="Active Users"
                value="500+"
                icon={FiUsers}
                color="bg-sa-yellow"
                description="Monthly active users"
              />
              <StatCard
                title="System Status"
                value="Online"
                icon={FiCheckCircle}
                color="bg-green-500"
                description="All systems operational"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-sa-green text-white hover:bg-sa-green/90'
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                  <span>{loading ? 'Updating...' : 'Update Holiday Data'}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center space-x-2 px-4 py-3 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiBarChart3} />
                  <span>View Analytics</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('adsense')}
                  className="flex items-center space-x-2 px-4 py-3 bg-sa-yellow text-black rounded-lg hover:bg-sa-yellow/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiDollarSign} />
                  <span>AdSense Settings</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Data Management</h3>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Last Update:</span>
                  <span className="text-sm text-gray-800">{lastUpdate}</span>
                </div>
                
                <motion.button
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-sa-green text-white hover:bg-sa-green/90'
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                  <span>
                    {loading ? 'Updating...' : 'Update from Government APIs'}
                  </span>
                </motion.button>
              </div>

              {updateStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    updateStatus === 'success'
                      ? 'bg-green-100 text-green-800'
                      : updateStatus === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <SafeIcon icon={updateStatus === 'success' ? FiCheckCircle : FiAlertTriangle} />
                  <span className="text-sm">
                    {updateStatus === 'success' && 'Holidays updated successfully!'}
                    {updateStatus === 'error' && 'Error updating holidays. Please try again.'}
                    {updateStatus === 'updating' && 'Fetching latest holiday data...'}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">System Info</h3>
              
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Data Sources:</span>
                  <span className="text-sm text-gray-800">Government APIs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Cache Status:</span>
                  <span className="text-sm text-green-600 flex items-center space-x-1">
                    <SafeIcon icon={FiCheckCircle} />
                    <span>Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Database:</span>
                  <span className="text-sm text-gray-800 flex items-center space-x-1">
                    <SafeIcon icon={FiDatabase} />
                    <span>LocalStorage</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Years Available:</span>
                  <span className="text-sm text-gray-800">
                    {new Date().getFullYear() - 5} - {new Date().getFullYear() + 10}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adsense' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">AdSense Configuration</h3>

            {/* Content Display Toggles */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Content Display Settings</h4>
              <p className="text-sm text-gray-600 mb-4">
                Toggle between showing custom content or AdSense ads for each section. When content is ON, custom text/images are displayed. When OFF, AdSense ads are shown.
              </p>
              
              <div className="space-y-3">
                <ContentToggle 
                  position="header" 
                  label="Header Section" 
                  enabled={adSenseForm.showHeaderContent}
                />
                <ContentToggle 
                  position="sidebar" 
                  label="Sidebar Section" 
                  enabled={adSenseForm.showSidebarContent}
                />
                <ContentToggle 
                  position="footer" 
                  label="Footer Section" 
                  enabled={adSenseForm.showFooterContent}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">AdSense Settings</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Publisher ID
                  </label>
                  <input
                    type="text"
                    value={adSenseForm.publisherId}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, publisherId: e.target.value })}
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Header Ad Slot ID
                  </label>
                  <input
                    type="text"
                    value={adSenseForm.headerSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, headerSlot: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Sidebar Ad Slot ID
                  </label>
                  <input
                    type="text"
                    value={adSenseForm.sidebarSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, sidebarSlot: e.target.value })}
                    placeholder="0987654321"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Footer Ad Slot ID
                  </label>
                  <input
                    type="text"
                    value={adSenseForm.footerSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, footerSlot: e.target.value })}
                    placeholder="1122334455"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="adsense-enabled"
                    checked={adSenseForm.enabled}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, enabled: e.target.checked })}
                    className="w-4 h-4 text-sa-green bg-gray-100 border-gray-300 rounded focus:ring-sa-green focus:ring-2"
                  />
                  <label htmlFor="adsense-enabled" className="text-sm font-medium text-gray-700">
                    Enable AdSense Ads
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">Current Configuration</h4>
                
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">AdSense Status:</span>
                    <span className={`text-sm font-bold ${adSenseConfig.enabled ? 'text-green-600' : 'text-red-600'}`}>
                      {adSenseConfig.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Publisher ID:</span>
                    <span className="text-sm text-gray-800">
                      {adSenseConfig.publisherId || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Header Content:</span>
                    <span className={`text-sm font-bold ${adSenseConfig.showHeaderContent ? 'text-green-600' : 'text-blue-600'}`}>
                      {adSenseConfig.showHeaderContent ? 'Content' : 'AdSense'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Sidebar Content:</span>
                    <span className={`text-sm font-bold ${adSenseConfig.showSidebarContent ? 'text-green-600' : 'text-blue-600'}`}>
                      {adSenseConfig.showSidebarContent ? 'Content' : 'AdSense'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Footer Content:</span>
                    <span className={`text-sm font-bold ${adSenseConfig.showFooterContent ? 'text-green-600' : 'text-blue-600'}`}>
                      {adSenseConfig.showFooterContent ? 'Content' : 'AdSense'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleAdSenseSave}
                className="flex items-center space-x-2 px-6 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiSave} />
                <span>Save AdSense Settings</span>
              </motion.button>
              
              {adSenseSaveStatus && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-green-600 flex items-center space-x-1"
                >
                  <SafeIcon icon={FiCheckCircle} />
                  <span>Settings saved successfully!</span>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </motion.div>
  );
};

export default AdminPanel;