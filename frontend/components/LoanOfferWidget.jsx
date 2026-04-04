import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function LoanOfferWidget() {
  return (
    <div className="moniqo-card col-span-1 p-6 relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-none shadow-[0_15px_40px_rgb(15,23,42,0.3)]">
      {/* Decorative Glows */}
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"></div>
      <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="relative z-10 flex justify-between items-center mb-6">
        <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" /> Pre-Approved Loan
        </h2>
        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
          Ready to disburse
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-start gap-1 mb-6">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recommended Principal</span>
        <h1 className="text-[36px] font-black text-white leading-tight tracking-tight">₹4,500,000</h1>
      </div>

      <div className="flex gap-3 mb-6 relative z-10">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tenure</p>
          <span className="text-base font-extrabold text-white">24 Months</span>
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Est. EMI</p>
          <span className="text-base font-extrabold text-white">₹221,450/m</span>
        </div>
      </div>

      <button className="relative z-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg group">
        Initiate ARENA Bidding
        <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
