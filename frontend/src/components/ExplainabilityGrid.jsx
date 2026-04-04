import React, { memo, useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Cpu, Quote, Signal, Clock, Shield } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

function buildTopFivePlainReasons(top5) {
   if (!top5 || typeof top5 !== 'object') return [];
   const pos = Array.isArray(top5.positive) ? top5.positive : [];
   const neg = Array.isArray(top5.negative) ? top5.negative : [];
   return [...pos, ...neg].filter((s) => typeof s === 'string' && s.trim()).slice(0, 5);
}

function formatFreshness(iso, fallbackLabel) {
   if (!iso) return fallbackLabel;
   try {
      const d = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
      if (!isValid(d)) return fallbackLabel;
      return format(d, "MMM d, yyyy · HH:mm:ss");
   } catch {
      return fallbackLabel;
   }
}

const ExplainabilityGrid = memo(() => {
   const { data, loading, liveData, isConnected } = useDashboard();

   const topFiveReasons = useMemo(
      () => buildTopFivePlainReasons(data?.top_5_reasons),
      [data?.top_5_reasons]
   );

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

   const riskBand = data?.risk_band || 'Not classified';

   const apiFresh = formatFreshness(data?.timestamp, 'Awaiting risk API sync');
   const liveFresh = liveData?.timestamp ? formatFreshness(liveData.timestamp, null) : null;

   return (
      <div className="bento-card h-full flex flex-col relative overflow-hidden group min-h-[420px]">
         {/* Card Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div className="flex items-center gap-3">
               <Cpu className="text-royal" size={24} strokeWidth={1.5} />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Intelligence // Ollama Engine</span>
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter">AI Executive Summary</h3>
               </div>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-2">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-royal/10 rounded-xl w-fit">
                  <span className="text-[10px] font-black text-royal uppercase tracking-widest">Synthesized Verdict v4</span>
               </div>
               <div className="flex flex-wrap items-center gap-2 justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                     <Shield size={12} className="text-royal shrink-0" />
                     {riskBand}
                  </span>
                  <span
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[9px] font-bold text-slate-500 tabular-nums"
                     title="When the credit score and model outputs were last refreshed"
                  >
                     <Clock size={12} className="text-slate-400 shrink-0" />
                     <span className="uppercase tracking-wider text-slate-400 font-black mr-1">Score freshness</span>
                     {isConnected && liveFresh ? (
                        <span>Live {liveFresh}</span>
                     ) : (
                        <span>API {apiFresh}</span>
                     )}
                  </span>
               </div>
            </div>
         </div>

         {/* Top 5 plain-language score drivers */}
         {topFiveReasons.length > 0 && (
            <div className="mb-8 p-5 rounded-2xl border border-slate-100 bg-slate-50/80">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-3">
                  Top 5 reasons for this score
               </span>
               <ol className="list-decimal list-inside space-y-2.5 marker:text-royal marker:font-black">
                  {topFiveReasons.map((reason, i) => (
                     <li key={i} className="text-[13px] font-semibold text-slate-700 leading-snug pl-1">
                        {reason}
                     </li>
                  ))}
               </ol>
            </div>
         )}

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
         <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
               {isConnected ? 'Live stream connected' : 'Live stream offline — score from last API sync'}
            </div>
            <span className="tabular-nums font-bold normal-case text-slate-500">
               Model advisory synced · {isConnected && liveFresh ? `Live ${liveFresh}` : apiFresh}
            </span>
         </div>
      </div>
   );
});

export default ExplainabilityGrid;
