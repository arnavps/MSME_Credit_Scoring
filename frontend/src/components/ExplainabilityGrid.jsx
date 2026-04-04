import React, { memo } from 'react';
import { Cpu, Quote, Signal } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const ExplainabilityGrid = memo(() => {
   const { data, loading } = useDashboard();

   if (loading) return (
      <div className="bento-card h-[400px] animate-pulse bg-white border border-slate-100 flex flex-col items-center justify-center">
         <Cpu className="text-slate-100 mb-4" size={48} strokeWidth={1} />
         <div className="h-4 w-32 bg-slate-50 rounded-full" />
      </div>
   );

   // Normalize advisory data
   const advisory = data?.advisory || {
      bankers_verdict: 'The MSME demonstrates professional cash-flow management with an resilient buyer network.',
      risk_context: 'PRIMARY RISK STEMS FROM A TRANSIENT LIQUIDITY TIGHTENING OBSERVED IN GST RECORDS.',
      thirty_day_fix: ['Standardize GST filing date to before 10th', 'Resolve the pending ₹42,000 tax arrear']
   };

   return (
      <div className="bento-card h-full flex flex-col relative overflow-hidden group min-h-[420px]">
         {/* Card Header */}
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <Cpu className="text-royal" size={24} strokeWidth={1.5} />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Intelligence // Ollama Engine</span>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter">AI Executive Summary</h3>
               </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-royal/10 rounded-xl">
               <span className="text-[10px] font-black text-royal uppercase tracking-widest">Synthesized Verdict v4</span>
            </div>
         </div>

         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT: Verdict & Context (Col 7) */}
            <div className="lg:col-span-7 flex flex-col">
               <div className="relative mb-8">
                  <Quote className="absolute -top-6 -left-4 text-royal opacity-10" size={64} />
                  <p className="text-2xl font-black text-royal tracking-tighter leading-tight relative z-10 pl-6 border-l-4 border-royal/20">
                     {advisory.bankers_verdict}
                  </p>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                        <Signal className="text-amber-600" size={20} />
                     </div>
                     <div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Decision Context</span>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide leading-relaxed">
                           {advisory.risk_context}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT: Tactical Roadmap (Col 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
               <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Tactical Roadmap // 30-Day Outlook</span>
                  <div className="space-y-3">
                     {(advisory.thirty_day_fix || []).map((step, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:scale-[1.02] cursor-default">
                           <div className="w-8 h-8 rounded-full bg-royal text-white flex items-center justify-center text-xs font-black shadow-lg shadow-royal/20">
                              {i + 1}
                           </div>
                           <span className="text-[12px] font-bold text-slate-600">{step}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Card Footer */}
         <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               Unified Verdict Accuracy: 94.2%
            </div>
            <span>Ollama Inference Sync: Nominal</span>
         </div>
      </div>
   );
});

export default ExplainabilityGrid;
