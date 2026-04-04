import React from 'react'
import { Plus, ChevronRight } from 'lucide-react'

function CreditCard({ isDark, num, date }) {
  return (
    <div className={`relative p-5 rounded-2xl overflow-hidden shadow-sm flex-1 min-w-[200px] h-[130px] flex flex-col justify-between ${isDark ? 'bg-[#151f32] text-white' : 'bg-[#1e2a44] text-white'}`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
          <div className="w-4 h-3 flex gap-[1px]">
            <div className="w-[3px] h-full bg-white/60"></div>
            <div className="w-[3px] h-full bg-white/60"></div>
            <div className="w-[3px] h-full bg-white/60"></div>
          </div>
        </div>
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-md"></div>
          <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-md"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex gap-2 text-[10px] tracking-widest text-slate-300">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span className="font-bold text-white text-xs">{num}</span>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest">Card Holder</p>
            <p className="text-xs font-bold text-slate-100">BayFi</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-400 uppercase tracking-widest">Expires</p>
            <p className="text-xs font-bold text-slate-100">{date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WalletChip({ flag, currency, amount, isActive }) {
  return (
    <div className={`flex flex-col p-3 rounded-2xl border transition-all flex-1 min-w-[120px] ${isActive ? 'bg-white border-blue-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] scale-105' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm shadow-sm rounded-full overflow-hidden leading-none block">{flag}</span>
          <span className="text-xs font-bold text-slate-600">{currency}</span>
        </div>
        <ChevronRight size={14} className="text-slate-400" />
      </div>
      <div>
        <h4 className="text-base font-extrabold text-slate-800 tracking-tight">{amount}</h4>
        <div className="flex items-center gap-1 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
          <span className={`text-[9px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </div>
  )
}

export default function CardsAndWallets() {
  return (
    <div className="col-span-1 flex flex-col gap-6">
      {/* My Cards Section */}
      <div className="moniqo-card p-6 h-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-700">My Cards</h2>
          <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors">
            <Plus size={12} strokeWidth={3} />
            Add New Card
          </button>
        </div>
        <div className="flex gap-4">
          <CreditCard isDark={true} num="6782" date="08/29" />
          <CreditCard isDark={false} num="5228" date="04/28" />
        </div>
      </div>
    </div>
  )
}
