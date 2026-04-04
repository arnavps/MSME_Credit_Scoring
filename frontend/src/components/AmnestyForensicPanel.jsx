import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

const AmnestyForensicPanel = ({ previewData }) => {
  if (!previewData) return null;

  const { baseline_score, amnesty_score, boost, is_eligible, neutralized_factors } = previewData;
  const delta = amnesty_score - baseline_score;

  return (
    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5 animate-in fade-in zoom-in-95 duration-500">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h3 className="text-lg font-black tracking-tight uppercase">Policy Amnesty Forensics</h3>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            Q3-FY2024 Window Active
          </div>
        </div>

        {/* COMPARISON BRIDGE */}
        <div className="grid grid-cols-11 gap-2 items-center mb-10">
          {/* Baseline */}
          <div className="col-span-4 text-center">
            <div className="text-3xl font-black text-slate-500 mb-1">{baseline_score}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Raw Model Score</div>
          </div>

          {/* Plus Sign */}
          <div className="col-span-1 flex justify-center">
            <span className="text-xl font-black text-emerald-500/50">+</span>
          </div>

          {/* Correction */}
          <div className="col-span-2 text-center">
            <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
              {boost}
              <ArrowUpRight size={16} />
            </div>
            <div className="text-[8px] font-black text-emerald-500/60 uppercase tracking-tighter">Post-hoc Correction</div>
          </div>

          {/* Equal Sign */}
          <div className="col-span-1 flex justify-center">
            <span className="text-xl font-black text-emerald-500/50">=</span>
          </div>

          {/* Final */}
          <div className="col-span-3 text-center">
            <div className="text-4xl font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {amnesty_score}
            </div>
            <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Balanced Score</div>
          </div>
        </div>

        {/* NEUTRALIZED FACTORS */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={12} className="text-emerald-400" />
            Neutralized Risk Signals
          </h4>
          
          {neutralized_factors.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {neutralized_factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                  <span className="text-xs font-bold text-slate-300 capitalize">
                    {factor.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 line-through">Impact: HIGH</span>
                    <div className="px-2 py-0.5 bg-emerald-500/20 text-[8px] font-black text-emerald-400 rounded-lg border border-emerald-500/30">
                      FLOOR: 0.85
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase">No active filters applied to this MSME</span>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <AlertCircle size={12} />
              <span>Verifying as per GOI Notification S.O. 42(E)</span>
           </div>
           <button 
             onClick={() => {}} 
             className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 underline underline-offset-4 pointer-events-none opacity-50"
           >
              Amnesty History
           </button>
        </div>
      </div>
    </div>
  );
};

export default AmnestyForensicPanel;
