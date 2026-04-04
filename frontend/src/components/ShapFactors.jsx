import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const ShapFactors = ({ factors }) => {
  const positive = factors?.filter(f => f.impact > 0) || [];
  const negative = factors?.filter(f => f.impact < 0) || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          <TrendingUp size={14} className="text-status-low" />
          Positive Catalysts
        </h3>
        <div className="space-y-3">
          {positive.map((f, i) => (
            <div key={i} className="flex items-center justify-between group cursor-help">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-status-low shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-sm font-medium text-slate-700 underline decoration-slate-200 decoration-dotted underline-offset-4 decoration-2">
                  {f.feature}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info size={12} className="text-slate-300" />
              </div>
            </div>
          ))}
          {positive.length === 0 && <p className="text-xs text-slate-400 italic">No significant positive factors detected.</p>}
        </div>
      </div>

      <div className="h-[1px] bg-slate-100" />

      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          <TrendingDown size={14} className="text-status-critical" />
          Risk Inhibitors
        </h3>
        <div className="space-y-3">
          {negative.map((f, i) => (
            <div key={i} className="flex items-center justify-between group cursor-help">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-status-critical shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <span className="text-sm font-medium text-slate-700 underline decoration-slate-200 decoration-dotted underline-offset-4 decoration-2">
                  {f.feature}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info size={12} className="text-slate-300" />
              </div>
            </div>
          ))}
          {negative.length === 0 && <p className="text-xs text-slate-400 italic">No major risk inhibitors found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ShapFactors;
