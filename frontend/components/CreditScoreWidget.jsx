import React, { useEffect, useState } from 'react'

export default function CreditScoreWidget() {
  const [offset, setOffset] = useState(351.8); // 2 * PI * r (56) = 351.8

  useEffect(() => {
    // 742 score out of 900 -> approx 82% 
    // 351.8 * (1 - 0.82) = 63.3 offset
    const timer = setTimeout(() => {
      setOffset(63.3);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="moniqo-card p-6 flex-1 flex flex-col justify-between">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-slate-700">Credit Score</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time ML risk assessment</p>
      </div>
      
      <div className="flex justify-center items-center py-6 flex-1">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
            <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <circle 
              cx="72" cy="72" r="60" 
              stroke="url(#gradient)" 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray="377" 
              strokeDashoffset={offset} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out" 
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
            <span className="text-[34px] font-extrabold text-slate-800 leading-none">742</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">CMR-3</span>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Sync</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Updated: Just Now</span>
      </div>
    </div>
  )
}
