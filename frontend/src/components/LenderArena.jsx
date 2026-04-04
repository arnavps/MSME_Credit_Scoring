import React, { memo } from 'react';
import { Sparkles, ArrowRight, Wallet, TrendingUp } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const LenderArena = memo(() => {
  const { data, loading } = useDashboard();

  if (loading) return (
    <div className="bento-card h-full flex flex-col justify-center items-center animate-pulse">
      <Wallet className="text-slate-100 mb-4" size={48} strokeWidth={1} />
      <div className="h-4 w-40 bg-slate-50 rounded-full mb-2" />
    </div>
  );

  const recommendation = data?.recommendation || { amount: 1850000, tenure: 18, rate: 11.5 };
  const { amount, tenure, rate } = recommendation;

  // Real-time EMI Calculation: [P * r * (1+r)^n] / [(1+r)^n - 1]
  const calculateEMI = (P, annualRate, n) => {
    if (!P || !annualRate || !n) return 0;
    const r = (annualRate / 12) / 100;
    const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emiValue);
  };

  const emi = calculateEMI(amount, rate, tenure);

  return (
    <div className="bento-card h-full flex flex-col items-center">
      
      {/* Module Header */}
      <div className="w-full flex flex-col items-center text-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
          Arena // Marketplace
        </span>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Lender Optimization</h3>
      </div>

      <div className="flex-1 w-full flex flex-col items-center">
        {/* RECOMMENDED PRINCIPAL (CENTERED) */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Principal</p>
          <h2 className="text-6xl font-black text-royal tracking-tighter transition-none">
            ₹{(amount / 100000).toFixed(1)}L
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2 justify-center">
            <Sparkles size={20} strokeWidth={1} className="text-royal" />
            Max Eligibility: CredNexis Alpha
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center transition-none">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Market Rate</span>
            <div className="flex items-center gap-1 mt-1 text-royal">
              <span className="text-xl font-black tabular-nums">{rate}%</span>
              <span className="text-[9px] font-bold opacity-70">APR</span>
            </div>
            <TrendingUp size={20} strokeWidth={1} className="text-royal mt-2" />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center transition-none">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tenure</span>
            <div className="flex items-center gap-1 mt-1 text-royal">
              <span className="text-xl font-black tabular-nums">{tenure}</span>
              <span className="text-[9px] font-bold opacity-70">Months</span>
            </div>
            <TrendingUp size={20} strokeWidth={1} className="text-royal mt-2" />
          </div>
        </div>

        {/* EMI SUMMARY */}
        <div className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center transition-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Monthly EMI</span>
          <span className="text-3xl font-black text-royal tabular-nums transition-none">₹{emi.toLocaleString()}</span>
          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-4 py-1 rounded-lg uppercase tracking-widest border border-emerald-100">
             Verified
          </div>
        </div>
      </div>
    </div>
  );
});

export default LenderArena;
