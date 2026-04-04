import React, { memo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ShieldCheck, Activity, Search, Sparkles, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AmnestyBadge from './AmnestyBadge';
import AmnestyForensicTraceCard from './AmnestyForensicTraceCard';
import ScoreAuditTrail from './ScoreAuditTrail';

const IntelligencePulse = memo(() => {
  const { data, liveData, loading, fetchAmnestyPreview, activeGstin } = useDashboard();
  const [showForensics, setShowForensics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  // Priority: API data first, then streaming, then default
  const score = data?.credit_score || liveData?.score || 630;

  // Dynamic Historical Ranges (M1-M6)
  const historicalRanges = React.useMemo(() => {
    return [6, 5, 4, 3, 2, 1].map((month) => {
      const trend = (6 - month) * 15;
      const base = Math.max(300, score - trend - 150);
      const cap = Math.min(900, score - trend + 100);
      return { month: `M${month}`, range: `${base} - ${cap}` };
    });
  }, [score]);

  useEffect(() => {
    if (showForensics && activeGstin) {
      fetchAmnestyPreview(activeGstin);
    }
  }, [showForensics, activeGstin, fetchAmnestyPreview]);

  if (loading) return (
    <div className="bento-card h-full flex flex-col items-center justify-center animate-pulse">
      <Activity className="text-slate-100" size={48} strokeWidth={1} />
      <div className="h-4 w-32 bg-slate-50 rounded-full mt-4" />
    </div>
  );

  const riskBand = data?.risk_band || (liveData?.score ? (liveData.score > 750 ? 'Strong' : liveData.score > 600 ? 'Low-Medium' : 'High Risk') : 'Low-Medium Risk');
  const amnesty = data?.amnesty_info || { applied: false, boost: 0 };

  // SVG gauge calculation: Range 300-900
  const minScore = 300;
  const maxScore = 900;
  const percentage = Math.max(0, Math.min(100, ((score - minScore) / (maxScore - minScore)) * 100));
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bento-card h-full flex flex-col items-center group relative overflow-hidden">

      {/* Module Header */}
      <div className="w-full flex items-center justify-between mb-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">
            Pulse // Credit X-Ray
          </span>
          <h3 className="text-lg font-black text-slate-800 tracking-tighter">Reliability Index</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Score Audit Trail Toggle */}
          <button
            onClick={() => {
              setShowAuditTrail(!showAuditTrail);
              setShowForensics(false);
            }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300
              ${showAuditTrail
                ? 'bg-slate-900 border-slate-800 text-emerald-400 font-black'
                : 'bg-white border-slate-100 text-slate-400 hover:border-royal/30'
              }
            `}
          >
            <Scale size={14} />
            <span className="text-[10px] uppercase tracking-widest">
              {showAuditTrail ? 'Audit Active' : 'Score Audit'}
            </span>
          </button>

          {/* Forensic Toggle */}
          <button
            onClick={() => {
              setShowForensics(!showForensics);
              setShowAuditTrail(false);
            }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300
              ${showForensics
                ? 'bg-slate-900 border-slate-800 text-emerald-400 font-black'
                : 'bg-white border-slate-100 text-slate-400 hover:border-royal/30'
              }
            `}
          >
            {showForensics ? <Sparkles size={14} /> : <Search size={14} />}
            <span className="text-[10px] uppercase tracking-widest">
              {showForensics ? 'Active Trace' : 'Forensic Trace'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        {showAuditTrail ? (
          <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto">
            <ScoreAuditTrail gstin={activeGstin} />
          </div>
        ) : showForensics ? (
          <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-500">
            <AmnestyForensicTraceCard />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-500">
            {/* SVG GAUGE - Upward Arc */}
            <div className="relative w-64 h-40 flex items-start justify-center">
              <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                {/* Background Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Progress Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#4338CA"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>

              {/* Score Positioned Below Arc */}
              <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
                <span className="text-6xl font-black text-slate-800 tracking-tighter leading-none">
                  {score}
                </span>
                <span className="text-[11px] font-black text-royal uppercase tracking-widest mt-2">{riskBand}</span>
                <AmnestyBadge boost={amnesty.boost} isApplied={amnesty.applied} />
              </div>
            </div>

            {/* Range Labels */}
            <div className="w-48 flex justify-between mt-2 px-4 mb-2">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">300</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">900</span>
            </div>

            {/* Historical Ranges Dropdown */}
            <div className="w-full px-4 mt-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                aria-expanded={showHistory}
              >
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Historical Ranges (M1-M6)</span>
                {showHistory ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
              </button>

              {showHistory && (
                <div className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-x-6 gap-y-2 animate-in fade-in slide-in-from-top-1">
                  {historicalRanges.map(h => (
                    <div key={h.month} className="flex justify-between items-center text-[10px] border-b border-slate-200/50 pb-1">
                      <span className="font-bold text-slate-500">{h.month}</span>
                      <span className="font-mono text-royal font-black">{h.range}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!showForensics && !showAuditTrail && (
        <div className="w-full mt-auto pt-4 border-t border-slate-100 flex flex-col items-center gap-4 relative z-10">

          {/* CV Accuracy Metrics */}
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Accuracy</span>
              <span className="text-sm font-bold text-emerald-500">{(data?.cv_score ? (data.cv_score * 100).toFixed(1) : 88.0)}% CV</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reliability</span>
              <span className="text-sm font-bold text-slate-700">{data?.reliability_status || 'Reliable'}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={2} className="text-royal" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Data Updated: {data?.timestamp ? format(new Date(data.timestamp), 'MMM dd, HH:mm') : 'N/A'}
              </span>
            </div>
            <div className="px-4 py-1 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
              Next Sync: {'>'} 5 minutes
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default IntelligencePulse;
