import React, { useEffect } from 'react';
import { useAdSense } from '../context/AdSenseContext';

const AdSenseAd = ({ slot, className = '', position = 'default', isAdmin = false }) => {
  const { adSenseConfig } = useAdSense();

  useEffect(() => {
    // In a real application, you would load the AdSense script here
    // For demo purposes, we'll just show a placeholder
    // Example of how to load AdSense:
    /* 
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
    */
  }, []);

  const getSlotId = () => {
    switch (position) {
      case 'header':
        return adSenseConfig.headerSlot || slot;
      case 'sidebar':
        return adSenseConfig.sidebarSlot || slot;
      case 'footer':
        return adSenseConfig.footerSlot || slot;
      default:
        return slot;
    }
  };

  // Check if content should be shown instead of ads for this position
  const shouldShowContent = () => {
    switch (position) {
      case 'header':
        return adSenseConfig.showHeaderContent;
      case 'sidebar':
        return adSenseConfig.showSidebarContent;
      case 'footer':
        return adSenseConfig.showFooterContent;
      default:
        return false;
    }
  };

  // If content is enabled for this position, don't show ads
  if (shouldShowContent()) {
    return null;
  }

  // Show placeholder if AdSense is not configured or not enabled
  if (!adSenseConfig.enabled || !adSenseConfig.publisherId) {
    return (
      <div className={`adsense-container ${className}`}>
        <div className="text-center text-gray-400 p-8">
          <div className="mb-2">📢</div>
          <div className="text-sm">AdSense Ad Space</div>
          <div className="text-xs">Position: {position}</div>
          <div className="text-xs text-red-400">Not configured</div>
          {isAdmin && (
            <div className="text-xs text-blue-400 mt-2">
              Configure in Admin Panel
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      {/* In production, replace this with actual AdSense code */}
      <div className="text-center text-gray-400 p-8">
        <div className="mb-2">📢</div>
        <div className="text-sm">AdSense Ad Active</div>
        <div className="text-xs">Publisher: {adSenseConfig.publisherId}</div>
        <div className="text-xs">Slot: {getSlotId()}</div>
        <div className="text-xs">Position: {position}</div>
        {isAdmin && (
          <div className="text-xs text-green-400 mt-2">
            Live AdSense
          </div>
        )}
      </div>
      
      {/* Example AdSense code structure (commented out for demo):
      <ins 
        className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={`ca-pub-${adSenseConfig.publisherId}`}
        data-ad-slot={getSlotId()}
        data-ad-format="auto"
        data-full-width-responsive="true"
      >
      </ins>
      */}
    </div>
  );
};

export default AdSenseAd;