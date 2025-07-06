import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState({
    pageViews: [],
    holidayViews: [],
    searchQueries: [],
    userSessions: [],
    downloads: [],
    viewModeChanges: [],
    yearSelections: []
  });

  const [currentSession, setCurrentSession] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      startTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      actions: []
    };
    
    setCurrentSession(session);
    trackEvent('session_start', { sessionId });

    // Load existing analytics data
    const storedAnalytics = localStorage.getItem('sa-holidays-analytics');
    if (storedAnalytics) {
      setAnalytics(JSON.parse(storedAnalytics));
    }

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('page_blur', { timestamp: new Date().toISOString() });
      } else {
        trackEvent('page_focus', { timestamp: new Date().toISOString() });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      trackEvent('session_end', { 
        sessionId,
        duration: Date.now() - new Date(session.startTime).getTime()
      });
    };
  }, []);

  // Save analytics data whenever it changes
  useEffect(() => {
    localStorage.setItem('sa-holidays-analytics', JSON.stringify(analytics));
  }, [analytics]);

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const trackEvent = (eventName, data = {}) => {
    const event = {
      id: generateEventId(),
      name: eventName,
      timestamp: new Date().toISOString(),
      sessionId: currentSession?.id,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    setAnalytics(prev => {
      const newAnalytics = { ...prev };
      
      // Add to current session
      if (currentSession) {
        currentSession.actions.push(event);
      }

      // Categorize events
      switch (eventName) {
        case 'page_view':
          newAnalytics.pageViews.push(event);
          break;
        case 'holiday_view':
          newAnalytics.holidayViews.push(event);
          break;
        case 'search_query':
          newAnalytics.searchQueries.push(event);
          break;
        case 'pdf_download':
          newAnalytics.downloads.push(event);
          break;
        case 'view_mode_change':
          newAnalytics.viewModeChanges.push(event);
          break;
        case 'year_selection':
          newAnalytics.yearSelections.push(event);
          break;
        case 'session_start':
          newAnalytics.userSessions.push(currentSession);
          break;
      }

      return newAnalytics;
    });
  };

  const generateEventId = () => {
    return 'event_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const trackPageView = (page) => {
    trackEvent('page_view', { page });
  };

  const trackHolidayView = (holiday) => {
    trackEvent('holiday_view', { 
      holidayId: holiday.id,
      holidayName: holiday.name,
      holidayDate: holiday.date,
      holidayType: holiday.type
    });
  };

  const trackSearch = (query, results) => {
    trackEvent('search_query', { 
      query,
      resultCount: results.length,
      hasResults: results.length > 0
    });
  };

  const trackDownload = (type, filename) => {
    trackEvent('pdf_download', { type, filename });
  };

  const trackViewModeChange = (from, to) => {
    trackEvent('view_mode_change', { from, to });
  };

  const trackYearSelection = (year) => {
    trackEvent('year_selection', { year });
  };

  const trackAdminAction = (action, data = {}) => {
    trackEvent('admin_action', { action, ...data });
  };

  const getAnalyticsData = () => {
    return analytics;
  };

  const getPopularHolidays = () => {
    const holidayViews = analytics.holidayViews.reduce((acc, view) => {
      const holidayName = view.data.holidayName;
      acc[holidayName] = (acc[holidayName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(holidayViews)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views);
  };

  const getSearchAnalytics = () => {
    const queries = analytics.searchQueries.map(q => q.data.query.toLowerCase());
    const queryCount = queries.reduce((acc, query) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {});

    const topQueries = Object.entries(queryCount)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalSearches = analytics.searchQueries.length;
    const successfulSearches = analytics.searchQueries.filter(q => q.data.hasResults).length;
    const searchSuccessRate = totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0;

    return {
      topQueries,
      totalSearches,
      successfulSearches,
      searchSuccessRate
    };
  };

  const getUsageMetrics = () => {
    const totalSessions = analytics.userSessions.length;
    const totalPageViews = analytics.pageViews.length;
    const totalDownloads = analytics.downloads.length;
    
    const viewModeStats = analytics.viewModeChanges.reduce((acc, change) => {
      const mode = change.data.to;
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    const yearStats = analytics.yearSelections.reduce((acc, selection) => {
      const year = selection.data.year;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSessions,
      totalPageViews,
      totalDownloads,
      viewModeStats,
      yearStats,
      averagePageViewsPerSession: totalSessions > 0 ? (totalPageViews / totalSessions).toFixed(2) : 0
    };
  };

  const getTimeBasedAnalytics = () => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filterByTime = (events, timeframe) => {
      return events.filter(event => new Date(event.timestamp) >= timeframe);
    };

    return {
      last24Hours: {
        pageViews: filterByTime(analytics.pageViews, last24Hours).length,
        searches: filterByTime(analytics.searchQueries, last24Hours).length,
        downloads: filterByTime(analytics.downloads, last24Hours).length
      },
      last7Days: {
        pageViews: filterByTime(analytics.pageViews, last7Days).length,
        searches: filterByTime(analytics.searchQueries, last7Days).length,
        downloads: filterByTime(analytics.downloads, last7Days).length
      },
      last30Days: {
        pageViews: filterByTime(analytics.pageViews, last30Days).length,
        searches: filterByTime(analytics.searchQueries, last30Days).length,
        downloads: filterByTime(analytics.downloads, last30Days).length
      }
    };
  };

  const clearAnalytics = () => {
    setAnalytics({
      pageViews: [],
      holidayViews: [],
      searchQueries: [],
      userSessions: [],
      downloads: [],
      viewModeChanges: [],
      yearSelections: []
    });
    localStorage.removeItem('sa-holidays-analytics');
  };

  const exportAnalytics = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sa-holidays-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const value = {
    analytics,
    currentSession,
    trackEvent,
    trackPageView,
    trackHolidayView,
    trackSearch,
    trackDownload,
    trackViewModeChange,
    trackYearSelection,
    trackAdminAction,
    getAnalyticsData,
    getPopularHolidays,
    getSearchAnalytics,
    getUsageMetrics,
    getTimeBasedAnalytics,
    clearAnalytics,
    exportAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};