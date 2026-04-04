import React from 'react'
import { AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react'

export default function FraudRiskIndicator() {
  const alerts = [
    { title: "Unusual GST/UPI Divergence", level: "critical", time: "12m ago" },
    { title: "Velocity of round-dollar transactions", level: "warning", time: "3h ago" }
  ]

  return (
    <div className="moniqo-card col-span-1 relative overflow-hidden">
      {/* Decorative gradient bleed */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl"></div>

      <div className="flex justify-between items-center mb-5 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            Fraud Sentinel <ShieldAlert size={16} className="text-rose-500" strokeWidth={2.5}/>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Automated Pre-NPA Alerts</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-4 relative z-10">
        <span className="text-sm font-bold text-slate-700">2 <span className="font-medium text-slate-400">alerts detected</span></span>
        <span className="text-xs font-bold text-rose-500">Elevated Risk</span>
      </div>
      
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5 relative z-10">
        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: '45%' }}></div>
      </div>
      
      <div className="flex flex-col gap-2 relative z-10">
        {alerts.map((a, i) => (
          <div key={i} className="flex gap-3 items-center p-2.5 rounded-xl border border-rose-100/50 bg-rose-50/50">
            <AlertCircle size={14} className={a.level === 'critical' ? 'text-rose-500' : 'text-amber-500'} strokeWidth={2.5} />
            <span className="text-[11px] font-bold text-slate-700 flex-1 leading-none">{a.title}</span>
            <span className="text-[9px] font-semibold text-slate-400">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
