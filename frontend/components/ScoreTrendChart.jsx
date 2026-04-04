import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity } from 'lucide-react'

const data = [
  { name: 'Jan', score: 680 },
  { name: 'Feb', score: 685 },
  { name: 'Mar', score: 692 },
  { name: 'Apr', score: 710 },
  { name: 'May', score: 725 },
  { name: 'Jun', score: 738 },
  { name: 'Jul', score: 742 },
]

export default function ScoreTrendChart() {
  return (
    <div className="moniqo-card col-span-1 h-full flex flex-col pt-6 px-6 pb-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Credit Visibility Trend</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-widest">Historical 7-Month Growth</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Activity size={16} strokeWidth={3} />
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} 
            />
            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
