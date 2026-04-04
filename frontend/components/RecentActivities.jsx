import React from 'react'
import { Search, Filter, Youtube, CreditCard, Building2, Heart, ShoppingBag, Palette, ShoppingCart } from 'lucide-react'

// Mock Data from Image
const activities = [
  { id: 'INV_000075', icon: Youtube, color: 'text-red-500', bg: 'bg-red-50', name: 'Youtube', price: '₹24', status: 'Complete', statCol: 'text-emerald-500', statDot: 'bg-emerald-500', date: '22-02-2026', time: '11:34 AM', checked: false },
  { id: 'INV_000074', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50', name: '****6578', price: '₹250', status: 'Complete', statCol: 'text-emerald-500', statDot: 'bg-emerald-500', date: '19-02-2026', time: '09:20 AM', checked: false },
  { id: 'INV_000073', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', name: 'Hotel Booking', price: '₹32,750', status: 'Pending', statCol: 'text-amber-500', statDot: 'bg-amber-500', date: '18-02-2026', time: '08:46 PM', checked: false },
  { id: 'INV_000072', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', name: 'Health Care', price: '₹1,246', status: 'Complete', statCol: 'text-emerald-500', statDot: 'bg-emerald-500', date: '18-02-2026', time: '12:01 AM', checked: false },
  { id: 'INV_000071', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', name: 'Amazon', price: '₹17,302', status: 'Complete', statCol: 'text-emerald-500', statDot: 'bg-emerald-500', date: '15-02-2026', time: '11:57 PM', checked: false },
  { id: 'INV_000070', icon: Palette, color: 'text-blue-600', bg: 'bg-blue-50', name: 'Photoshop', price: '₹36', status: 'Canceled', statCol: 'text-rose-500', statDot: 'bg-rose-500', date: '14-02-2026', time: '09:42 AM', checked: true },
  { id: 'INV_000069', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-50', name: 'Grocery purchase', price: '₹270', status: 'Complete', statCol: 'text-emerald-500', statDot: 'bg-emerald-500', date: '12-02-2026', time: '10:59 PM', checked: false },
]

export default function RecentActivities() {
  return (
    <div className="moniqo-card col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-700">Recent Activities</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs w-24 placeholder:text-slate-400 text-slate-600 font-medium" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600">
            Filter <Filter size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Order ID</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activities.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-[4px] border ${item.checked ? 'bg-blue-600 border-blue-600 flex items-center justify-center' : 'border-slate-200 bg-white'}`}>
                      {item.checked && <span className="text-white text-[8px] leading-none mb-[1px]">✓</span>}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{item.id}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                      <item.icon size={14} className={item.color} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 text-xs font-extrabold text-slate-800">{item.price}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.statDot}`}></div>
                    <span className={`text-[11px] font-bold ${item.statCol}`}>{item.status}</span>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <p className="text-[11px] font-medium text-slate-500">{item.date} <span className="text-slate-400 ml-1">{item.time}</span></p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
