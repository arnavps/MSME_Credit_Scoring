import React, { useEffect, useState, useRef } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

// Royal Blue Accent
const ROYAL_BLUE = '#4338CA';
const FIVE_MINUTES = 300000; // 5 minutes in ms

// Utility: Format time ago
const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Never';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
};

// Glassmorphism Card Base Styles
const glassStyles = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
};

// LIVE SYNC Pulse Animation Styles
const pulseStyles = `
  @keyframes subtlePulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .live-pulse {
    animation: subtlePulse 2s ease-in-out infinite;
  }
`;

function CreditScoreCard() {
  const [score, setScore] = useState(742);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [displayTimeAgo, setDisplayTimeAgo] = useState('Just now');
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Fetch score with 5-minute stale-while-revalidate
  const fetchScore = async (force = false) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated;
    
    // Check if 5 minutes have passed or if forced refresh
    if (!force && timeSinceLastUpdate < FIVE_MINUTES) {
      console.log(`Skipping fetch - last update was ${Math.floor(timeSinceLastUpdate / 1000)}s ago`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulated API call - replace with actual endpoint
      const response = await fetch('http://localhost:8000/score/current', {
        headers: {
          'If-Modified-Since': new Date(lastUpdated).toUTCString(),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (isMounted.current) {
          setScore(data.credit_score || 742);
          setLastUpdated(Date.now());
          setDisplayTimeAgo('Just now');
        }
      }
    } catch (error) {
      console.error('Failed to fetch score:', error);
      // Keep existing score on error (stale-while-revalidate)
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };
  
  // Initial fetch on mount
  useEffect(() => {
    fetchScore();
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Update "time ago" display when component becomes visible
  useEffect(() => {
    // Only update the display text when user re-focuses the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setDisplayTimeAgo(getTimeAgo(lastUpdated));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastUpdated]);
  
  // Manual refresh handler
  const handleManualRefresh = () => {
    const timeSinceLastUpdate = Date.now() - lastUpdated;
    if (timeSinceLastUpdate >= FIVE_MINUTES) {
      fetchScore(true);
    }
  };
  
  // Calculate percentage for gauge
  const maxScore = 900;
  const percentage = (score / maxScore) * 100;
  
  return (
    <>
      <style>{pulseStyles}</style>
      <div style={glassStyles} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${ROYAL_BLUE}15` }}
            >
              <Activity size={20} color={ROYAL_BLUE} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-500">Credit Score</span>
            </div>
          </div>
          
          {/* LIVE SYNC Indicator */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div 
                className="live-pulse w-2 h-2 rounded-full"
                style={{ backgroundColor: '#10B981' }}
              />
            </div>
            <span className="text-xs font-semibold text-emerald-500">LIVE SYNC</span>
          </div>
        </div>
        
        {/* Score Display - Static, no flicker */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Radial Gauge */}
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Gradient Arc */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor={ROYAL_BLUE} />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.64} 264`}
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Center Score - Static Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                className="text-5xl font-black text-slate-800 tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {score}
              </span>
              <span className="text-sm text-slate-400 font-medium mt-1">of {maxScore}</span>
            </div>
          </div>
          
          {/* Risk Badge */}
          <div 
            className="px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: `${ROYAL_BLUE}15`, 
              color: ROYAL_BLUE,
              letterSpacing: '0.05em'
            }}
          >
            Low Risk
          </div>
        </div>
        
        {/* Footer - Last Updated & Refresh */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Updated: {displayTimeAgo}
          </span>
          
          <button
            onClick={handleManualRefresh}
            disabled={isLoading || (Date.now() - lastUpdated) < FIVE_MINUTES}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isLoading || (Date.now() - lastUpdated) < FIVE_MINUTES
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </>
  );
}

export default CreditScoreCard;
