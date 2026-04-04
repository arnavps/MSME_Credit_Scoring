import React from 'react'

export default function SpendingLimitCard() {
  return (
    <div className="moniqo-card col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-700">Monthly Spending Limit</h2>
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <span className="text-[10px]">✓</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700">₹1,400 <span className="font-medium text-slate-400">spent</span></span>
        <span className="text-xs font-semibold text-slate-400">₹5,500 limit</span>
      </div>
      
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '25%' }}></div>
      </div>
      
      <p className="text-xs text-slate-500 font-medium tracking-wide">
        You've spent <span className="font-extrabold text-slate-700">25%</span> of your monthly limit.
      </p>
    </div>
  )
}
