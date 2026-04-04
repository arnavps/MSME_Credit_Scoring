import React from 'react'
import { Search, Bell, Info, ChevronDown } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-12 py-8 bg-background">
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl text-[#0B1A40]">CredNexis</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-full shadow-sm">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors relative">
            <Bell size={20} strokeWidth={2.5} />
            <div className="w-2 h-2 bg-rose-500 rounded-full absolute top-2.5 right-2.5 shadow-sm"></div>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <Info size={20} strokeWidth={2.5} />
          </button>
        </div>

        <button className="flex items-center gap-3 bg-white pl-1.5 pr-4 py-1.5 rounded-full shadow-sm hover:bg-slate-50 transition-colors border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <span className="font-bold text-white text-xs">B</span>
          </div>
          <span className="font-bold text-sm text-slate-700">BayFi</span>
          <ChevronDown size={16} className="text-slate-400 ml-1" strokeWidth={3} />
        </button>
      </div>
    </header>
  )
}
