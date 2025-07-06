import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAnalytics } from '../context/AnalyticsContext';
import ReactECharts from 'echarts-for-react';

const { 
  FiBarChart3, 
  FiTrendingUp, 
  FiUsers, 
  FiSearch, 
  FiDownload, 
  FiCalendar,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiTrash2,
  FiExternalLink
} = FiIcons;

const AnalyticsDashboard = () => {
  const { 
    getPopularHolidays, 
    getSearchAnalytics, 
    getUsageMetrics, 
    getTimeBasedAnalytics,
    clearAnalytics,
    exportAnalytics
  } = useAnalytics();

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const [metrics, setMetrics] = useState({
    popular: [],
    search: {},
    usage: {},
    timeBased: {}
  });

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        popular: getPopularHolidays(),
        search: getSearchAnalytics(),
        usage: getUsageMetrics(),
        timeBased: getTimeBasedAnalytics()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearAnalytics = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      clearAnalytics();
      setRefreshKey(prev => prev + 1);
    }
  };

  const getPopularHolidaysChartOption = () => {
    const data = metrics.popular.slice(0, 10);
    return {
      title: {
        text: 'Most Viewed Holidays',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.map(item => item.views),
        type: 'bar',
        itemStyle: {
          color: '#007A4D'
        }
      }]
    };
  };

  const getTimeBasedChartOption = () => {
    const data = metrics.timeBased;
    return {
      title: {
        text: 'Activity Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Page Views', 'Searches', 'Downloads'],
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Page Views',
          type: 'line',
          data: [data.last24Hours?.pageViews || 0, data.last7Days?.pageViews || 0, data.last30Days?.pageViews || 0],
          itemStyle: { color: '#007A4D' }
        },
        {
          name: 'Searches',
          type: 'line',
          data: [data.last24Hours?.searches || 0, data.last7Days?.searches || 0, data.last30Days?.searches || 0],
          itemStyle: { color: '#002395' }
        },
        {
          name: 'Downloads',
          type: 'line',
          data: [data.last24Hours?.downloads || 0, data.last7Days?.downloads || 0, data.last30Days?.downloads || 0],
          itemStyle: { color: '#FFB612' }
        }
      ]
    };
  };

  const getViewModeChartOption = () => {
    const data = metrics.usage.viewModeStats || {};
    const chartData = Object.entries(data).map(([mode, count]) => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      value: count
    }));

    return {
      title: {
        text: 'View Mode Preferences',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  };

  const StatCard = ({ title, value, icon, color = 'bg-sa-green', change = null }) => (
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
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <SafeIcon icon={FiTrendingUp} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <SafeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-sa-green text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleRefresh}
            className="p-2 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiRefreshCw} />
          </motion.button>
          <motion.button
            onClick={exportAnalytics}
            className="p-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiExternalLink} />
          </motion.button>
          <motion.button
            onClick={handleClearAnalytics}
            className="p-2 bg-sa-red text-white rounded-lg hover:bg-sa-red/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiTrash2} />
          </motion.button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessions"
          value={metrics.usage.totalSessions || 0}
          icon={FiUsers}
          color="bg-sa-green"
        />
        <StatCard
          title="Page Views"
          value={metrics.usage.totalPageViews || 0}
          icon={FiEye}
          color="bg-sa-blue"
        />
        <StatCard
          title="Total Searches"
          value={metrics.search.totalSearches || 0}
          icon={FiSearch}
          color="bg-sa-yellow"
        />
        <StatCard
          title="Downloads"
          value={metrics.usage.totalDownloads || 0}
          icon={FiDownload}
          color="bg-sa-red"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        <TabButton
          id="overview"
          label="Overview"
          isActive={activeTab === 'overview'}
          onClick={setActiveTab}
        />
        <TabButton
          id="holidays"
          label="Holiday Analytics"
          isActive={activeTab === 'holidays'}
          onClick={setActiveTab}
        />
        <TabButton
          id="search"
          label="Search Analytics"
          isActive={activeTab === 'search'}
          onClick={setActiveTab}
        />
        <TabButton
          id="usage"
          label="Usage Patterns"
          isActive={activeTab === 'usage'}
          onClick={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ReactECharts option={getTimeBasedChartOption()} style={{ height: '300px' }} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ReactECharts option={getViewModeChartOption()} style={{ height: '300px' }} />
            </div>
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ReactECharts option={getPopularHolidaysChartOption()} style={{ height: '400px' }} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Holidays</h3>
              <div className="space-y-2">
                {metrics.popular.slice(0, 10).map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{holiday.name}</span>
                    <span className="text-sa-green font-bold">{holiday.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Search Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Searches</span>
                  <span className="font-bold">{metrics.search.totalSearches || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Successful Searches</span>
                  <span className="font-bold">{metrics.search.successfulSearches || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-bold">{(metrics.search.searchSuccessRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Top Search Queries</h3>
              <div className="space-y-2">
                {(metrics.search.topQueries || []).map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">"{query.query}"</span>
                    <span className="text-sa-blue font-bold">{query.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Usage Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Page Views per Session</span>
                  <span className="font-bold">{metrics.usage.averagePageViewsPerSession || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Downloads</span>
                  <span className="font-bold">{metrics.usage.totalDownloads || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Year Selections</h3>
              <div className="space-y-2">
                {Object.entries(metrics.usage.yearStats || {}).map(([year, count]) => (
                  <div key={year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{year}</span>
                    <span className="text-sa-green font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;