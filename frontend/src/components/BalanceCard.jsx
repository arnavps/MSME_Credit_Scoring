import React, { useEffect, useState, useRef } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw } from 'lucide-react';

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

// Utility: Format INR currency
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

function BalanceCard() {
  const [balance, setBalance] = useState(689372.00);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [displayTimeAgo, setDisplayTimeAgo] = useState('Just now');
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Fetch balance with 5-minute stale-while-revalidate
  const fetchBalance = async (force = false) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated;
    
    // Check if 5 minutes have passed or if forced refresh
    if (!force && timeSinceLastUpdate < FIVE_MINUTES) {
      console.log(`Skipping balance fetch - last update was ${Math.floor(timeSinceLastUpdate / 1000)}s ago`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulated API call - replace with actual endpoint
      const response = await fetch('http://localhost:8000/balance/current', {
        headers: {
          'If-Modified-Since': new Date(lastUpdated).toUTCString(),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (isMounted.current) {
          setBalance(data.balance || 689372.00);
          setLastUpdated(Date.now());
          setDisplayTimeAgo('Just now');
        }
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      // Keep existing balance on error (stale-while-revalidate)
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };
  
  // Initial fetch on mount
  useEffect(() => {
    fetchBalance();
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Update "time ago" display when component becomes visible
  useEffect(() => {
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
      fetchBalance(true);
    }
  };
  
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
              <Wallet size={20} color={ROYAL_BLUE} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-500">Total Balance</span>
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
        
        {/* Balance Display - Static, High Contrast */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1 mb-4">
            <span 
              className="text-4xl font-black text-slate-800 tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              {formatINR(balance)}
            </span>
          </div>
          
          {/* Trend Pill - Green */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full mb-8">
            <TrendingUp size={14} color="#10B981" />
            <span className="text-sm font-semibold text-emerald-600">+12.5%</span>
            <span className="text-xs text-emerald-400">vs last month</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: ROYAL_BLUE }}
          >
            <ArrowUpRight size={18} strokeWidth={2} />
            <span>Transfer</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
            <ArrowDownLeft size={18} strokeWidth={2} />
            <span>Request</span>
          </button>
        </div>
        
        {/* Footer - Last Updated & Refresh */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
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

export default BalanceCard;
