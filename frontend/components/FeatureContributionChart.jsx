import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts'
import { Network } from 'lucide-react'

// Dummy feature contribution data
const data = [
  { name: 'Credit Util.', value: -12.4 },
  { name: 'GST Filing', value: 25.8 },
  { name: 'UPI Bounce', value: -18.2 },
  { name: 'Vintage', value: 8.5 },
  { name: 'Rev Drop', value: -9.3 },
  { name: 'Def. Ratio', value: 14.1 }
]

export default function FeatureContributionChart() {
  return (
    <div className="moniqo-card col-span-1 p-6 h-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-700">Feature Weights</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">LightGBM Global Impact</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
          <Network size={14} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
            <XAxis type="number" hide domain={[-30, 30]} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '6px 12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} 
            />
            <ReferenceLine x={0} stroke="#cbd5e1" strokeDasharray="3 3"/>
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
