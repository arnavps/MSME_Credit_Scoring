import React, { memo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MousePointerClick, CreditCard, FileText, ClipboardList, Activity } from 'lucide-react';

const FeatureSparks = memo(() => {
  const { streamVelocities, loading } = useDashboard();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full animate-pulse">
      <Activity className="text-slate-100 mb-2" size={32} />
      <div className="h-4 w-24 bg-slate-50 rounded-full" />
    </div>
  );

  const sources = [
    { label: 'UPI', value: streamVelocities?.upi || 12, icon: MousePointerClick },
    { label: 'POS', value: streamVelocities?.pos || 8, icon: CreditCard },
    { label: 'GST', value: streamVelocities?.gst || 4, icon: FileText },
    { label: 'E-WAY', value: streamVelocities?.eway || 2, icon: ClipboardList },
  ];

  const maxValue = Math.max(...sources.map(s => s.value));

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="w-full flex flex-col mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
          Intelligence // Data Ingress
        </span>
        <h3 className="text-xl font-black text-slate-800 tracking-tighter">Transaction Flow Analysis</h3>
      </div>

      <div className="flex-1 flex flex-col">
        {/* VERTICAL BARS CONTAINER */}
        <div className="flex-1 flex items-end justify-between px-4 pb-2 relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-t border-slate-300 border-dashed" />
            ))}
          </div>

          {sources.map((source, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group h-full justify-end relative z-10 transition-none">
              {/* Value Label */}
              <span className="text-[10px] font-black text-royal mb-2 tabular-nums">
                {source.value}
              </span>
              
              {/* Vertical Bar (Static) */}
              <div className="w-10 bg-slate-50 border border-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end transition-none">
                <div 
                  className="w-full bg-royal rounded-t-md transition-none relative"
                  style={{ height: `${(source.value / maxValue) * 100}%` }}
                >
                   {/* Static Shine Effect */}
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 opacity-30" />
                </div>
              </div>

              {/* Icon & Label */}
              <div className="flex flex-col items-center gap-1 mt-2">
                <source.icon size={20} strokeWidth={1} className="text-royal" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{source.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Node Velocity: NOMINAL
        </span>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
          Stream Verified
        </div>
      </div>
    </div>
  );
});

export default FeatureSparks;
