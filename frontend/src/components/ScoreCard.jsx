import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Zap, Activity } from 'lucide-react';

/**
 * ScoreCard Component
 * Displays the credit score with smooth CSS transitions
 * and EMA smoothing information
 */
function ScoreCard() {
  const { data } = useDashboard();
  
  const score = data?.credit_score || 650;
  const cmr = data?.cmr_equivalent || 'CMR-4';
  const riskBand = data?.risk_band || 'MEDIUM';
  
  // Determine color based on score
  const getScoreColor = (s) => {
    if (s >= 750) return 'text-emerald-500';
    if (s >= 650) return 'text-blue-500';
    if (s >= 550) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreBg = (s) => {
    if (s >= 750) return 'bg-emerald-50 border-emerald-200';
    if (s >= 650) return 'bg-blue-50 border-blue-200';
    if (s >= 550) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${getScoreBg(score)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="text-slate-400" size={18} />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Credit Score
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
        </div>
      </div>

      {/* Score Display with CSS Transition */}
      <div className="text-center py-4">
        <div 
          className={`text-7xl font-black ${getScoreColor(score)} tabular-nums`}
          style={{
            transition: 'all 0.5s ease-in-out'
          }}
        >
          {score}
        </div>
        <div className="text-sm text-slate-400 mt-1">/ 900</div>
      </div>

      {/* Score Details */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
        <div className="text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">CMR</div>
          <div className="text-sm font-bold text-slate-700">{cmr}</div>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Risk</div>
          <div className={`text-sm font-bold ${getScoreColor(score)}`}>{riskBand}</div>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Status</div>
          <div className="text-sm font-bold text-emerald-600">Active</div>
        </div>
      </div>

      {/* EMA Indicator (if available) */}
      {data?.smoothing && (
        <div className="mt-4 pt-3 border-t border-slate-200/50">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>EMA Smoothed (α=0.15)</span>
            <span>Δ{data.smoothing.delta > 0 ? '+' : ''}{data.smoothing.delta}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreCard;
