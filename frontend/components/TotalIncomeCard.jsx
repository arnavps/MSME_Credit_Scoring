import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Jan', profit: 45, loss: 20 },
  { name: 'Feb', profit: 60, loss: 25 },
  { name: 'Mar', profit: 35, loss: 45 },
  { name: 'Apr', profit: 80, loss: 10 },
  { name: 'May', profit: 55, loss: 30 },
  { name: 'Jun', profit: 70, loss: 25 },
  { name: 'Jul', profit: 40, loss: 35 },
]

export default function TotalIncomeCard() {
  return (
    <div className="moniqo-card col-span-1 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-700">Total Income</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">View your income in a certain period of time</p>
      </div>
      
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={6}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <Tooltip 
              cursor={{fill: '#f1f5f9'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} 
            />
            <Bar dataKey="profit" fill="#2563eb" radius={[4, 4, 4, 4]} barSize={12} />
            <Bar dataKey="loss" fill="#bfdbfe" radius={[4, 4, 4, 4]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold text-slate-500">Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-200"></div>
          <span className="text-xs font-bold text-slate-500">Loss</span>
        </div>
      </div>
    </div>
  )
}
