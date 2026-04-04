import React from 'react'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function TotalBalanceCard() {
  return (
    <div className="moniqo-card col-span-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-slate-700">Total Balance</h2>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="w-4 h-4 rounded-full bg-slate-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1/3 bg-orange-500"></div>
              <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-emerald-600"></div>
            </div>
            <span className="text-xs font-bold text-slate-600">INR</span>
          </div>
        </div>
        
        <h1 className="text-[40px] leading-tight font-extrabold text-slate-800 tracking-tight mb-3">
          ₹689,372.00
        </h1>
        
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
            <ArrowUpRight size={14} strokeWidth={3} />
            <span>5%</span>
          </div>
          <span className="text-xs font-medium text-slate-400">than last month</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-10">
        <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm">
          <ArrowUpRight size={16} strokeWidth={2.5} className="text-slate-400" />
          Transfer
        </button>
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgb(67,56,202,0.3)]">
          <ArrowDownLeft size={16} strokeWidth={2.5} />
          Request
        </button>
      </div>
    </div>
  )
}
