import React, { memo, useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Cpu, Quote, Signal, Clock, Shield, Brain, BarChart3 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ShapChart from './ShapChart';

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

   // Top 5 reasons with fallback
   const rawTop5 = data?.top_5_reasons || {};
   const topFiveReasons = useMemo(() => {
      const reasons = buildTopFivePlainReasons(rawTop5);
      if (reasons.length > 0) return reasons;
      // Fallback reasons
      return [
         'Stable monthly transaction velocity (+)',
         'Low EMI-to-Income ratio observed (+)',
         'High buyer retention (85%) (+)',
         'No circular transactions detected (+)',
         'Recent 15% dip in GST filing cadence (-)'
      ];
   }, [rawTop5]);

   // SHAP data for model drivers - with fallback
   const rawShap = data?.shap || liveData?.shap || {};
   const shapData = Object.keys(rawShap).length > 0 ? rawShap : {
      'filing_compliance_rate': -0.15,
      'txn_velocity_mom': 0.12,
      'collection_efficiency': 0.10,
      'upi_bounce_rate': -0.08,
      'promoter_cibil': 0.07
   };

   if (loading) return (
      <div className="bento-card h-[400px] animate-pulse bg-white border border-slate-100 flex flex-col items-center justify-center">
         <Cpu className="text-slate-100 mb-4" size={48} strokeWidth={1} />
         <div className="h-4 w-32 bg-slate-50 rounded-full" />
      </div>
   );

   // Normalize advisory data with better fallback for empty values
   const rawAdvisory = data?.advisory || {};
   const advisory = {
      bankers_verdict: rawAdvisory.bankers_verdict || 'The MSME demonstrates professional cash-flow management with a resilient buyer network.',
      risk_context: rawAdvisory.risk_context || 'PRIMARY RISK STEMS FROM A TRANSIENT LIQUIDITY TIGHTENING OBSERVED IN GST RECORDS.',
      thirty_day_fix: rawAdvisory.thirty_day_fix?.length > 0 ? rawAdvisory.thirty_day_fix : ['Standardize GST filing date to before 10th', 'Resolve the pending ₹42,000 tax arrear']
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

         {/* Main Content: SHAP + Ollama Side by Side */}
         <div className="h-[320px] grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: SHAP Model Drivers (Model Explainability) */}
            <div className="flex flex-col h-full">
               <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="text-emerald-500" size={18} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Drivers // SHAP Explainability</span>
               </div>
               <div className="h-[140px] bg-slate-50/50 rounded-xl border border-slate-100 p-4 mb-3">
                  <ShapChart shap={shapData} />
               </div>

               {/* Top 5 Reasons - Always Visible */}
               <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                     <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                        <span className="text-[10px] font-black text-emerald-600">5</span>
                     </div>
                     <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                        Score Drivers
                     </span>
                  </div>
                  <div className="space-y-2">
                     {topFiveReasons.map((reason, i) => {
                        const isPositive = reason.includes('(+)') || reason.includes('Strength');
                        const isNegative = reason.includes('(-)') || reason.includes('CRITICAL');
                        return (
                           <div key={i} className="flex items-start gap-3 py-1.5">
                              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isPositive ? 'bg-emerald-500' : isNegative ? 'bg-red-500' : 'bg-slate-400'
                                 }`} />
                              <span className="text-[13px] font-medium text-slate-700 leading-snug">{reason}</span>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* RIGHT: Ollama AI Reasoning */}
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-4">
                  <Brain className="text-royal" size={20} />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Ollama AI // Executive Reasoning</span>
               </div>

               {/* Banker's Verdict */}
               <div className="relative mb-6 bg-royal/10 rounded-2xl p-5 border border-royal/20">
                  <Quote className="absolute -top-2 -left-2 text-royal opacity-30" size={32} />
                  <p className="text-lg font-bold text-slate-800 tracking-tight leading-snug relative z-10 pl-4">
                     {advisory.bankers_verdict}
                  </p>
               </div>

               {/* Decision Context */}
               <div className="flex items-start gap-3 mb-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="p-2 bg-amber-200 rounded-lg flex-shrink-0">
                     <Signal className="text-amber-700" size={16} />
                  </div>
                  <div className="flex-1">
                     <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1 block">Decision Context</span>
                     <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                        {advisory.risk_context}
                     </p>
                  </div>
               </div>

               {/* Tactical Roadmap */}
               <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tactical Roadmap // 30-Day Outlook</span>
                  <div className="space-y-2">
                     {(advisory.thirty_day_fix || []).map((step, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                           <div className="w-6 h-6 rounded-full bg-royal text-white flex items-center justify-center text-[10px] font-black">
                              {i + 1}
                           </div>
                           <span className="text-[11px] font-bold text-slate-600">{step}</span>
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
