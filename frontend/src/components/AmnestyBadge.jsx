import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

const AmnestyBadge = ({ boost, isApplied }) => {
  if (!isApplied || boost <= 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
        <Sparkles size={14} className="text-emerald-500 fill-emerald-500/20" />
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
          GST Amnesty Applied: +{boost} Pts
        </span>
      </div>
      
      {/* Tooltip-style detail */}
      <div className="hidden group-hover:flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">
        <ShieldCheck size={10} />
        Policy Verified
      </div>
    </div>
  );
};

export default AmnestyBadge;
