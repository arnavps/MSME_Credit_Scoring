import React from 'react'

export default function TopReasonsWidget() {
  const reasons = [
    { text: "Consistent GST filing ratio (11/12 months)", positive: true, impact: "High Impact" },
    { text: "Low credit utilization ratio (28%)", positive: true, impact: "High Impact" },
    { text: "Stable business vintage (4.5 years)", positive: true, impact: "Medium Impact" },
    { text: "Elevated UPI transaction bounce rate (12%)", positive: false, impact: "High Impact" },
    { text: "Recent drop in quarterly gross revenue (-5%)", positive: false, impact: "Medium Impact" }
  ]

  return (
    <div className="moniqo-card col-span-1">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-700 leading-tight">Driving Factors</h2>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">SHAP Extracted Explanations</p>
      </div>

      <div className="flex flex-col gap-3">
        {reasons.map((r, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-slate-100/60 bg-slate-50 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${r.positive ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]'}`}></div>
              <span className={`text-[9px] font-extrabold uppercase tracking-widest ${r.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {r.positive ? 'Positive' : 'Negative'} Effect
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-auto">{r.impact}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-700 leading-tight pr-2">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
