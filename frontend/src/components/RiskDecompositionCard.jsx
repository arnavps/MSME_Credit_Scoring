import React, { memo } from 'react';
import { Zap } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ShapChart from './ShapChart';

const RiskDecompositionCard = memo(() => {
  const { data, liveData, loading } = useDashboard();

  if (loading) return (
    <div className="bento-card h-[560px] animate-pulse bg-white border border-slate-100 flex flex-col items-center justify-center">
      <Zap className="text-slate-100 mb-4" size={48} strokeWidth={1} />
      <div className="h-4 w-32 bg-slate-50 rounded-full" />
    </div>
  );

  const shapData = liveData?.shap || data?.top_5_reasons || { positive: [], negative: [] };

  return (
    <div className="bento-card h-[560px] flex flex-col relative overflow-hidden group">
      
      {/* Module Header */}
      <div className="w-full flex flex-col items-center text-center mb-6 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
          Sentinel // Risk Decomposition
        </span>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Behavioral Drivers</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <ShapChart shap={shapData} />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
           Explainability: SHAP High-Fidelity
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
        </div>
      </div>
    </div>
  );
});

export default RiskDecompositionCard;
