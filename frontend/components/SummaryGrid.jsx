import React from 'react'
import { ChevronDown, BarChart2, ShoppingBag, Wallet2, Link2 } from 'lucide-react'

function MiniCard({ title, amount, change, isPositive, extraClass, Icon }) {
  return (
    <div className={`p-4 rounded-2xl border border-slate-100 flex flex-col justify-between ${extraClass}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-50 text-slate-400">
          <Icon size={14} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">₹{amount}</h3>
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '↗' : '↙'} {change}%
          </div>
          <span className="text-[10px] font-medium text-slate-400">This month</span>
        </div>
      </div>
    </div>
  )
}

export default function SummaryGrid() {
  return (
    <div className="moniqo-card col-span-1">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-700">Summary</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Track your performance.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600">
          Weekly <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MiniCard title="Total Earnings" amount="950" change="7" isPositive={true} extraClass="bg-gradient-to-br from-blue-50 to-white" Icon={BarChart2} />
        <MiniCard title="Total Spending" amount="750" change="5" isPositive={false} extraClass="bg-white" Icon={ShoppingBag} />
        <MiniCard title="Total Income" amount="1,050" change="8" isPositive={true} extraClass="bg-white" Icon={Wallet2} />
        <MiniCard title="Total Spending" amount="750" change="4" isPositive={true} extraClass="bg-white" Icon={Link2} />
      </div>
    </div>
  )
}
